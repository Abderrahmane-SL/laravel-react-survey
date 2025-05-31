<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SurveyResultController extends Controller
{
    /**
     * Store a newly created survey result.
     */
    public function store(Request $request, Survey $survey)
    {
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|integer',
            'answers.*.answer' => 'required',
            'participant_email' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Check if survey is active and not expired
        if (!$survey->status) {
            return response()->json([
                'message' => 'Survey is not active'
            ], 403);
        }

        $currentDate = now();
        $expireDate = \Carbon\Carbon::parse($survey->expire_date);
        if ($currentDate->gt($expireDate)) {
            return response()->json([
                'message' => 'Survey has expired'
            ], 403);
        }

        $result = SurveyResult::create([
            'survey_id' => $survey->id,
            'participant_email' => $validated['participant_email'] ?? null,
            'answers' => $validated['answers'],
            'submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Survey response submitted successfully',
            'data' => $result
        ], 201);
    }

    /**
     * Get survey results for a specific survey.
     */
    public function index(Request $request, Survey $survey)
    {
        $user = $request->user();
        
        // Check if user owns the survey
        if ($user->id !== $survey->user_id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $results = SurveyResult::where('survey_id', $survey->id)
            ->orderBy('submitted_at', 'desc')
            ->get();

        // Process results for better frontend consumption
        $processedResults = $this->processResults($survey, $results);

        return response()->json([
            'survey' => $survey->load('questions'),
            'results' => $processedResults,
            'total_responses' => $results->count(),
            'completion_rate' => $this->calculateCompletionRate($survey, $results),
        ]);
    }

    /**
     * Process results for analytics.
     */
    private function processResults($survey, $results)
    {
        $processedAnswers = [];

        foreach ($results as $result) {
            foreach ($result->answers as $answer) {
                $questionId = $answer['question_id'];
                $answerValue = $answer['answer'];

                if (!isset($processedAnswers[$questionId])) {
                    $processedAnswers[$questionId] = [];
                }

                $processedAnswers[$questionId][] = [
                    'question_id' => $questionId,
                    'answer' => $answerValue,
                    'submitted_at' => $result->submitted_at,
                ];
            }
        }

        return $processedAnswers;
    }

    /**
     * Calculate completion rate.
     */
    private function calculateCompletionRate($survey, $results)
    {
        if ($results->isEmpty()) {
            return 0;
        }

        $totalQuestions = $survey->questions()->count();
        if ($totalQuestions === 0) {
            return 100;
        }

        $completedResponses = 0;
        foreach ($results as $result) {
            if (count($result->answers) >= $totalQuestions) {
                $completedResponses++;
            }
        }

        return round(($completedResponses / $results->count()) * 100, 2);
    }
}
