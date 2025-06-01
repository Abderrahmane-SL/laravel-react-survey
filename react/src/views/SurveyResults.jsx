"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosClient from "../axios.js"
import PageComponent from "../components/PageComponent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ChartBarIcon, UsersIcon, CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { toast } from "sonner"
import styled from "styled-components"

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const StatsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const StatCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: hsl(218.2 39.3% 57.1%);
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: hsl(215.4 16.3% 46.9%);
  font-weight: 500;
`

const QuestionCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  margin-bottom: 1.5rem;
`

const QuestionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(222.2 47.4% 11.2%);
  margin-bottom: 0.5rem;
`

const AnswerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  background-color: hsl(210 40% 98%);
`

const AnswerText = styled.span`
  font-weight: 500;
  color: hsl(222.2 47.4% 11.2%);
  flex: 1;
  margin-right: 1rem;
  word-break: break-word;
`

const AnswerCount = styled(Badge)`
  background-color: hsl(218.2 39.3% 57.1%);
  color: white;
  flex-shrink: 0;
`

const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: hsl(210 40% 98%);
  border-radius: 0.5rem;
  border: 1px dashed hsl(214.3 31.8% 91.4%);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: hsl(222.2 47.4% 11.2%);
  }
  
  p {
    color: hsl(215.4 16.3% 46.9%);
    margin-bottom: 1.5rem;
  }
`

export default function SurveyResults() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [survey, setSurvey] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      setLoading(true)
      axiosClient
        .get(`/survey/${id}/results`)
        .then(({ data }) => {
          setSurvey(data.survey)
          setResults(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching survey results:", err)
          if (err.response && err.response.status === 404) {
            setError("Survey not found or you don't have permission to view these results")
          } else if (err.response && err.response.status === 403) {
            setError("You don't have permission to view these results")
          } else {
            setError("Failed to load survey results. Please try again.")
          }
          setLoading(false)
          toast.error("Loading Failed", {
            description: "Unable to load survey results. Please try again.",
          })
        })
    }
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getQuestionResults = (questionId) => {
    if (!results || !results.results) return []
    return results.results[questionId] || []
  }

  const getAnswerStats = (questionId, questionType) => {
    const answers = getQuestionResults(questionId)

    if (answers.length === 0) {
      return []
    }

    if (questionType === "text" || questionType === "textarea") {
      return answers.map((answer, index) => ({
        text: answer.answer,
        count: 1,
        id: `${questionId}-${index}`,
      }))
    }

    // For select, radio, checkbox questions
    const answerCounts = {}
    answers.forEach((answer) => {
      const answerValue = answer.answer
      if (Array.isArray(answerValue)) {
        answerValue.forEach((val) => {
          answerCounts[val] = (answerCounts[val] || 0) + 1
        })
      } else {
        answerCounts[answerValue] = (answerCounts[answerValue] || 0) + 1
      }
    })

    return Object.entries(answerCounts)
      .map(([text, count]) => ({
        text,
        count,
        id: `${questionId}-${text}`,
      }))
      .sort((a, b) => b.count - a.count)
  }

  const goBackToSurvey = () => {
    navigate(`/surveys/${id}`)
  }

  if (loading) {
    return (
      <PageComponent title="Survey Results">
        <LoadingSkeleton>
          <StatsGrid>
            {[1, 2, 3].map((i) => (
              <StatCard key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </StatCard>
            ))}
          </StatsGrid>
          <Skeleton className="h-64 w-full" />
        </LoadingSkeleton>
      </PageComponent>
    )
  }

  if (error) {
    return (
      <PageComponent title="Survey Results">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={goBackToSurvey} className="flex items-center gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Survey
        </Button>
      </PageComponent>
    )
  }

  const totalResponses = results?.total_responses || 0
  const completionRate = results?.completion_rate || 0

  return (
    <PageComponent
      title={`Results: ${survey?.title || "Survey"}`}
      subtitle="View and analyze survey responses"
      buttons={
        <Button variant="outline" onClick={goBackToSurvey} className="flex items-center gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Survey
        </Button>
      }
    >
      <ResultsContainer>
        {/* Statistics */}
        <StatsGrid>
          <StatCard>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <UsersIcon className="h-6 w-6 text-primary mr-2" />
              </div>
              <StatValue>{totalResponses}</StatValue>
              <StatLabel>Total Responses</StatLabel>
            </CardContent>
          </StatCard>

          <StatCard>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <ChartBarIcon className="h-6 w-6 text-primary mr-2" />
              </div>
              <StatValue>{completionRate}%</StatValue>
              <StatLabel>Completion Rate</StatLabel>
            </CardContent>
          </StatCard>

          <StatCard>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CalendarIcon className="h-6 w-6 text-primary mr-2" />
              </div>
              <StatValue>{survey?.questions?.length || 0}</StatValue>
              <StatLabel>Total Questions</StatLabel>
            </CardContent>
          </StatCard>
        </StatsGrid>

        {/* Survey Info */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <strong>Created:</strong> {survey?.created_at ? formatDate(survey.created_at) : "N/A"}
              </div>
              <div>
                <strong>Expires:</strong> {survey?.expire_date ? formatDate(survey.expire_date) : "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Badge variant={survey?.status ? "default" : "secondary"}>{survey?.status ? "Active" : "Draft"}</Badge>
              </div>
            </div>
            {survey?.description && (
              <div className="mt-4">
                <strong>Description:</strong>
                <div className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: survey.description }} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* No Results Message */}
        {totalResponses === 0 && (
          <NoResultsMessage>
            <h3>No Responses Yet</h3>
            <p>
              This survey hasn't received any responses yet. Check back later or share your survey with more people.
            </p>
          </NoResultsMessage>
        )}

        {/* Question Results */}
        {totalResponses > 0 &&
          survey?.questions?.map((question, index) => {
            const answerStats = getAnswerStats(question.id, question.type)

            return (
              <QuestionCard key={question.id}>
                <CardHeader>
                  <QuestionTitle>
                    {index + 1}. {question.question}
                  </QuestionTitle>
                  {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
                </CardHeader>
                <CardContent>
                  {answerStats.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No responses for this question</p>
                  ) : (
                    <div className="space-y-2">
                      {answerStats.map((stat) => (
                        <AnswerItem key={stat.id}>
                          <AnswerText>
                            {question.type === "text" || question.type === "textarea" ? `"${stat.text}"` : stat.text}
                          </AnswerText>
                          <AnswerCount>{stat.count}</AnswerCount>
                        </AnswerItem>
                      ))}
                    </div>
                  )}
                </CardContent>
              </QuestionCard>
            )
          })}
      </ResultsContainer>
    </PageComponent>
  )
}
