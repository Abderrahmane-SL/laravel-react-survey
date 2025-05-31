"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import styled from "styled-components"

const QuestionCard = styled(Card)`
  margin-bottom: 1.5rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  background: white;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

const QuestionNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: hsl(218.2 39.3% 57.1%);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.75rem;
  flex-shrink: 0;
`

const QuestionTitle = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: hsl(222.2 47.4% 11.2%);
    line-height: 1.4;
    margin: 0;
    flex: 1;
  }
`

const QuestionDescription = styled.p`
  color: hsl(215.4 16.3% 46.9%);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 2.25rem;
`

const OptionsContainer = styled.div`
  margin-left: 2.25rem;
  space-y: 0.75rem;
`

const CheckboxOption = styled.div`
  display: flex;
  items-center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: hsl(210 40% 98%);
  }
`

const RadioOption = styled.div`
  display: flex;
  items-center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: hsl(210 40% 98%);
  }
`

const StyledInput = styled(Input)`
  margin-left: 2.25rem;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: hsl(218.2 39.3% 57.1%);
    box-shadow: 0 0 0 2px hsl(218.2 39.3% 57.1% / 0.2);
  }
`

const StyledTextarea = styled(Textarea)`
  margin-left: 2.25rem;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: hsl(218.2 39.3% 57.1%);
    box-shadow: 0 0 0 2px hsl(218.2 39.3% 57.1% / 0.2);
  }
`

const StyledSelect = styled.div`
  margin-left: 2.25rem;
`

export default function PublicQuestionView({ question, index, answerChanged }) {
  let selectedOptions = []

  function onCheckboxChange(option, checked) {
    if (checked) {
      selectedOptions.push(option.text)
    } else {
      selectedOptions = selectedOptions.filter((op) => op !== option.text)
    }
    answerChanged(selectedOptions)
  }

  return (
    <QuestionCard>
      <CardHeader className="pb-3">
        <QuestionTitle>
          <QuestionNumber>{index + 1}</QuestionNumber>
          <h3>{question.question}</h3>
        </QuestionTitle>
        {question.description && <QuestionDescription>{question.description}</QuestionDescription>}
      </CardHeader>

      <CardContent className="pt-0">
        {question.type === "select" && (
          <StyledSelect>
            <Select onValueChange={(value) => answerChanged(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Please select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.data.options.map((option) => (
                  <SelectItem key={option.uuid} value={option.text}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StyledSelect>
        )}

        {question.type === "radio" && (
          <OptionsContainer>
            <RadioGroup onValueChange={(value) => answerChanged(value)}>
              {question.data.options.map((option) => (
                <RadioOption key={option.uuid}>
                  <RadioGroupItem value={option.text} id={option.uuid} />
                  <Label htmlFor={option.uuid} className="flex-1 cursor-pointer text-sm font-medium">
                    {option.text}
                  </Label>
                </RadioOption>
              ))}
            </RadioGroup>
          </OptionsContainer>
        )}

        {question.type === "checkbox" && (
          <OptionsContainer>
            <div className="space-y-3">
              {question.data.options.map((option) => (
                <CheckboxOption key={option.uuid}>
                  <Checkbox id={option.uuid} onCheckedChange={(checked) => onCheckboxChange(option, checked)} />
                  <Label htmlFor={option.uuid} className="flex-1 cursor-pointer text-sm font-medium">
                    {option.text}
                  </Label>
                </CheckboxOption>
              ))}
            </div>
          </OptionsContainer>
        )}

        {question.type === "text" && (
          <StyledInput
            type="text"
            onChange={(ev) => answerChanged(ev.target.value)}
            placeholder="Type your answer here..."
          />
        )}

        {question.type === "textarea" && (
          <StyledTextarea
            onChange={(ev) => answerChanged(ev.target.value)}
            placeholder="Type your detailed answer here..."
          />
        )}
      </CardContent>
    </QuestionCard>
  )
}
