"use client"

import { PlusIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import QuestionEditor from "./QuestionEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import styled from "styled-components"

const QuestionsContainer = styled.div`
  margin-top: 1.5rem;
`

const QuestionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
`

const QuestionsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(222.2 47.4% 11.2%);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const QuestionCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  background-color: hsl(218.2 39.3% 57.1%);
  color: white;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 0.25rem;
`

const EmptyState = styled(Card)`
  text-align: center;
  padding: 3rem 2rem;
  border: 2px dashed hsl(214.3 31.8% 91.4%);
  background-color: hsl(210 40% 98%);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    background-color: white;
  }
`

const EmptyStateContent = styled.div`
  max-width: 20rem;
  margin: 0 auto;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(222.2 47.4% 11.2%);
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: hsl(215.4 16.3% 46.9%);
    font-size: 0.875rem;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }
`

const QuestionsGrid = styled.div`
  display: grid;
  gap: 1rem;
`

const AddQuestionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
`

export default function SurveyQuestions({ questions, onQuestionsUpdate }) {
  const [myQuestions, setMyQuestions] = useState([...questions])

  const addQuestion = (index) => {
    const insertIndex = index !== undefined ? index : myQuestions.length
    const newQuestion = {
      id: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
    }

    const newQuestions = [...myQuestions]
    newQuestions.splice(insertIndex, 0, newQuestion)
    setMyQuestions(newQuestions)
    onQuestionsUpdate(newQuestions)
  }

  const questionChange = (question) => {
    if (!question) return
    const newQuestions = myQuestions.map((q) => {
      if (q.id === question.id) {
        return { ...question }
      }
      return q
    })
    setMyQuestions(newQuestions)
    onQuestionsUpdate(newQuestions)
  }

  const deleteQuestion = (question) => {
    const newQuestions = myQuestions.filter((q) => q.id !== question.id)
    setMyQuestions(newQuestions)
    onQuestionsUpdate(newQuestions)
  }

  useEffect(() => {
    setMyQuestions(questions)
  }, [questions])

  return (
    <QuestionsContainer>
      <QuestionsHeader>
        <QuestionsTitle>
          Survey Questions
          <QuestionCount>{myQuestions.length}</QuestionCount>
        </QuestionsTitle>
        <AddQuestionButton onClick={() => addQuestion()}>
          <PlusIcon className="h-4 w-4" />
          Add Question
        </AddQuestionButton>
      </QuestionsHeader>

      {myQuestions.length === 0 ? (
        <EmptyState>
          <CardContent>
            <EmptyStateContent>
              <h4>No Questions Yet</h4>
              <p>
                Start building your survey by adding your first question. You can choose from different question types
                like text, multiple choice, and more.
              </p>
              <AddQuestionButton onClick={() => addQuestion()}>
                <PlusIcon className="h-4 w-4" />
                Add Your First Question
              </AddQuestionButton>
            </EmptyStateContent>
          </CardContent>
        </EmptyState>
      ) : (
        <QuestionsGrid>
          {myQuestions.map((q, ind) => (
            <QuestionEditor
              key={q.id}
              index={ind}
              question={q}
              questionChange={questionChange}
              addQuestion={addQuestion}
              deleteQuestion={deleteQuestion}
            />
          ))}
        </QuestionsGrid>
      )}
    </QuestionsContainer>
  )
}
