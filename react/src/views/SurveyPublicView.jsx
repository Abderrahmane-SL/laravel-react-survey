"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axiosClient from "../axios.js"
import PublicQuestionView from "../components/PublicQuestionView"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import styled from "styled-components"

const PublicContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(214.3 31.8% 91.4%) 100%);
  padding: 2rem 1rem;
`

const SurveyContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`

const SurveyHeader = styled(Card)`
  margin-bottom: 2rem;
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
`

const SurveyImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 0.5rem 0.5rem 0 0;
`

const SurveyTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: hsl(222.2 47.4% 11.2%);
  margin-bottom: 0.5rem;
  line-height: 1.2;
`

const SurveyDescription = styled.div`
  color: hsl(215.4 16.3% 46.9%);
  line-height: 1.6;
  
  p {
    margin-bottom: 0.5rem;
  }
`

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const SubmitContainer = styled(Card)`
  margin-top: 2rem;
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
`

const ThankYouCard = styled(Card)`
  background: linear-gradient(135deg, hsl(142.1 76.2% 36.3%) 0%, hsl(142.1 70.6% 45.3%) 100%);
  color: white;
  border: none;
  text-align: center;
  padding: 3rem 2rem;
`

const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const EmailInputContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: hsl(210 40% 98%);
  border-radius: 0.5rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
`

export default function SurveyPublicView() {
  const { slug } = useParams()
  const [survey, setSurvey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [participantEmail, setParticipantEmail] = useState("")

  const answerChanged = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }))
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    setSubmitting(true)
    setError("")

    const payload = {
      answers: Object.keys(answers).map((questionId) => ({
        question_id: Number.parseInt(questionId),
        answer: answers[questionId],
      })),
      participant_email: participantEmail || null,
    }

    axiosClient
      .post(`/survey/${survey.id}/answer`, payload)
      .then(() => {
        setSubmitted(true)
        toast.success("Survey Submitted!", {
          description: "Thank you for your participation. Your response has been recorded.",
        })
      })
      .catch((err) => {
        console.error("Survey submission error:", err)
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message)
        } else {
          setError("Failed to submit survey. Please check your answers and try again.")
        }
        toast.error("Submission Failed", {
          description: "Unable to submit your response. Please try again.",
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  useEffect(() => {
    if (!slug) {
      setError("Survey not found")
      setLoading(false)
      return
    }

    setLoading(true)
    axiosClient
      .get(`/survey/get-by-slug/${slug}`)
      .then(({ data }) => {
        setSurvey(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching survey:", err)
        setError("Survey not found or no longer available")
        setLoading(false)
        toast.error("Survey Not Found", {
          description: "This survey may have expired or been removed.",
        })
      })
  }, [slug])

  if (loading) {
    return (
      <PublicContainer>
        <SurveyContainer>
          <SurveyHeader>
            <CardContent className="p-6">
              <LoadingSkeleton>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </LoadingSkeleton>
            </CardContent>
          </SurveyHeader>
        </SurveyContainer>
      </PublicContainer>
    )
  }

  if (error && !survey) {
    return (
      <PublicContainer>
        <SurveyContainer>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </SurveyContainer>
      </PublicContainer>
    )
  }

  if (submitted) {
    return (
      <PublicContainer>
        <SurveyContainer>
          <ThankYouCard>
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-lg opacity-90">
                Your response has been recorded successfully. We appreciate your participation in this survey.
              </p>
            </CardContent>
          </ThankYouCard>
        </SurveyContainer>
      </PublicContainer>
    )
  }

  return (
    <PublicContainer>
      <SurveyContainer>
        <SurveyHeader>
          {survey?.image_url && <SurveyImage src={survey.image_url} alt={survey.title} />}
          <CardHeader>
            <SurveyTitle>{survey?.title}</SurveyTitle>
            {survey?.description && <SurveyDescription dangerouslySetInnerHTML={{ __html: survey.description }} />}
          </CardHeader>
        </SurveyHeader>

        <form onSubmit={onSubmit}>
          <EmailInputContainer>
            <Label htmlFor="participant_email">Your Email (Optional)</Label>
            <Input
              id="participant_email"
              type="email"
              value={participantEmail}
              onChange={(e) => setParticipantEmail(e.target.value)}
              placeholder="Enter your email address"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Providing your email is optional. It helps us identify your response if needed.
            </p>
          </EmailInputContainer>

          <QuestionsContainer>
            {survey?.questions?.map((question, index) => (
              <PublicQuestionView
                key={question.id}
                question={question}
                index={index}
                answerChanged={(value) => answerChanged(question, value)}
              />
            ))}
          </QuestionsContainer>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <SubmitContainer>
            <CardContent className="p-6 text-center">
              <Button type="submit" size="lg" disabled={submitting} className="min-w-[200px]">
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Submit Survey"
                )}
              </Button>
            </CardContent>
          </SubmitContainer>
        </form>
      </SurveyContainer>
    </PublicContainer>
  )
}
