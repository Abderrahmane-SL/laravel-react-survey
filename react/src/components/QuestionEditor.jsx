"use client"

import { v4 as uuidv4 } from "uuid"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useStateContext } from "../contexts/ContextProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import styled from "styled-components"
import { GripVerticalIcon } from "lucide-react"

const QuestionCard = styled(Card)`
  margin-bottom: 1.5rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  transition: all 0.2s ease;
  background: white;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
`

const QuestionHeader = styled(CardHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem 0.5rem;
`

const QuestionTitle = styled(CardTitle)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: hsl(222.2 47.4% 11.2%);
`

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: hsl(215.4 16.3% 46.9%);
  cursor: grab;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: hsl(210 40% 96.1%);
    color: hsl(222.2 47.4% 11.2%);
  }
  
  &:active {
    cursor: grabbing;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
  }
`

const OptionsContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(214.3 31.8% 91.4%);
`

const OptionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  border-radius: 0.375rem;
  background-color: hsl(210 40% 98%);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    background-color: white;
  }
`

const OptionNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: hsl(218.2 39.3% 57.1%);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: hsl(215.4 16.3% 46.9%);
  font-size: 0.875rem;
  background-color: hsl(210 40% 98%);
  border: 1px dashed hsl(214.3 31.8% 91.4%);
  border-radius: 0.375rem;
`

export default function QuestionEditor({ index = 0, question, addQuestion, deleteQuestion, questionChange }) {
  const [model, setModel] = useState({ ...question })
  const { questionTypes } = useStateContext()

  useEffect(() => {
    questionChange(model)
  }, [model])

  function upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function shouldHaveOptions(type = null) {
    type = type || model.type
    return ["select", "radio", "checkbox"].includes(type)
  }

  function onTypeChange(value) {
    const newModel = {
      ...model,
      type: value,
    }
    if (!shouldHaveOptions(model.type) && shouldHaveOptions(value)) {
      if (!model.data.options) {
        newModel.data = {
          options: [{ uuid: uuidv4(), text: "" }],
        }
      }
    }
    setModel(newModel)
  }

  function addOption() {
    const newOptions = [...(model.data.options || []), { uuid: uuidv4(), text: "" }]
    setModel({
      ...model,
      data: {
        ...model.data,
        options: newOptions,
      },
    })
  }

  function deleteOption(optionToDelete) {
    const newOptions = model.data.options.filter((option) => option.uuid !== optionToDelete.uuid)
    setModel({
      ...model,
      data: {
        ...model.data,
        options: newOptions,
      },
    })
  }

  function updateOption(optionUuid, newText) {
    const newOptions = model.data.options.map((option) =>
      option.uuid === optionUuid ? { ...option, text: newText } : option,
    )
    setModel({
      ...model,
      data: {
        ...model.data,
        options: newOptions,
      },
    })
  }

  return (
    <QuestionCard>
      <QuestionHeader>
        <QuestionTitle>
          <DragHandle>
            <GripVerticalIcon className="h-4 w-4" />
          </DragHandle>
          Question {index + 1}
          {model.question && `: ${model.question.substring(0, 30)}${model.question.length > 30 ? "..." : ""}`}
        </QuestionTitle>
        <ActionButtons>
          <Button type="button" variant="outline" size="sm" onClick={() => addQuestion(index + 1)} className="text-xs">
            <PlusIcon className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => deleteQuestion(question)}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <TrashIcon className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </ActionButtons>
      </QuestionHeader>

      <CardContent>
        <FormGrid>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}`}>Question Text</Label>
              <Input
                id={`question-${question.id}`}
                type="text"
                value={model.question}
                onChange={(ev) => setModel({ ...model, question: ev.target.value })}
                placeholder="Enter your question here..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${question.id}`}>Description (Optional)</Label>
              <Textarea
                id={`description-${question.id}`}
                value={model.description || ""}
                onChange={(ev) => setModel({ ...model, description: ev.target.value })}
                placeholder="Add additional context or instructions..."
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`type-${question.id}`}>Question Type</Label>
            <Select value={model.type} onValueChange={onTypeChange}>
              <SelectTrigger id={`type-${question.id}`} className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem value={type} key={type}>
                    {upperCaseFirst(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FormGrid>

        {shouldHaveOptions() && (
          <OptionsContainer>
            <OptionsHeader>
              <Label className="text-sm font-semibold">Answer Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="text-xs">
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Option
              </Button>
            </OptionsHeader>

            {(!model.data.options || model.data.options.length === 0) && (
              <EmptyState>
                <p>No options defined yet</p>
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add First Option
                </Button>
              </EmptyState>
            )}

            {model.data.options && model.data.options.length > 0 && (
              <div className="space-y-2">
                {model.data.options.map((option, ind) => (
                  <OptionItem key={option.uuid}>
                    <OptionNumber>{ind + 1}</OptionNumber>
                    <Input
                      type="text"
                      value={option.text}
                      onChange={(ev) => updateOption(option.uuid, ev.target.value)}
                      placeholder={`Option ${ind + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteOption(option)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </OptionItem>
                ))}
              </div>
            )}
          </OptionsContainer>
        )}
      </CardContent>
    </QuestionCard>
  )
}
