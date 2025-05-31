"use client"

import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon, CalendarIcon, EyeIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import TButton from "./core/TButton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import styled from "styled-components"

const SurveyCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  background: white;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border-color: hsl(213.3 31.8% 83.2%);
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 12rem;
  overflow: hidden;
  background-color: hsl(210 40% 96.1%);
`

const SurveyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${SurveyCard}:hover & {
    transform: scale(1.05);
  }
`

const StatusBadge = styled(Badge)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
  background-color: ${(props) => (props.variant === "default" ? "rgba(34, 197, 94, 0.9)" : "rgba(156, 163, 175, 0.9)")};
  color: white;
  border: none;
`

const SurveyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(222.2 47.4% 11.2%);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8rem;
`

const SurveyDescription = styled.div`
  color: hsl(215.4 16.3% 46.9%);
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  margin-bottom: 1rem;
`

const SurveyMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: hsl(215.4 16.3% 46.9%);
  padding-top: 0.75rem;
  border-top: 1px solid hsl(214.3 31.8% 91.4%);
  gap: 0.5rem;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(214.3 31.8% 91.4%);
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

export default function SurveyListItem({ survey, onDeleteClick }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <SurveyCard>
      <ImageContainer>
        {!imageError ? (
          <SurveyImage src={survey.image_url || "/placeholder.svg"} alt={survey.title} onError={handleImageError} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <EyeIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <StatusBadge variant={survey.status ? "default" : "secondary"}>
          {survey.status ? "Active" : "Draft"}
        </StatusBadge>
      </ImageContainer>

      <CardHeader className="pb-2">
        <SurveyTitle>{survey.title}</SurveyTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <SurveyDescription dangerouslySetInnerHTML={{ __html: survey.description }} />

        <SurveyMeta>
          <div className="meta-item">
            <CalendarIcon className="h-3 w-3" />
            <span>Created: {formatDate(survey.created_at)}</span>
          </div>
          <div className="meta-item">
            <CalendarIcon className="h-3 w-3" />
            <span>Expires: {formatDate(survey.expire_date)}</span>
          </div>
        </SurveyMeta>
      </CardContent>

      <CardFooter className="pt-0">
        <ActionButtons>
          <ButtonGroup>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TButton to={`/surveys/${survey.id}`} size="sm" variant="outline">
                    <PencilIcon className="h-4 w-4" />
                  </TButton>
                </TooltipTrigger>
                <TooltipContent>Edit Survey</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TButton href={`/view/survey/${survey.slug}`} size="sm" variant="outline" target="_blank">
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </TButton>
                </TooltipTrigger>
                <TooltipContent>View Public Survey</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ButtonGroup>

          {survey.id && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDeleteClick(survey.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Survey</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </ActionButtons>
      </CardFooter>
    </SurveyCard>
  )
}
