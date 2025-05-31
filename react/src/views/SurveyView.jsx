"use client"

import { LinkIcon, PhotoIcon, TrashIcon, CalendarIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TButton from "../components/core/TButton"
import PageComponent from "../components/PageComponent"
import SurveyQuestions from "../components/SurveyQuestions"
import axiosClient from "../axios.js"
import { useStateContext } from "../contexts/ContextProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import styled from "styled-components"
import { ImageIcon } from "lucide-react"

const FormContainer = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const ImagePreview = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px dashed hsl(214.3 31.8% 91.4%);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(210 40% 98%);
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(218.2 39.3% 57.1%);
    background-color: hsl(218.2 39.3% 57.1% / 0.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const FileInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
`

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

const FullWidthField = styled.div`
  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  border-radius: 0.5rem;
  background-color: hsl(210 40% 98%);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    background-color: white;
  }
`

const LoadingSkeleton = styled.div`
  space-y: 1.5rem;
`

export default function SurveyView() {
  const { showToast } = useStateContext()
  const navigate = useNavigate()
  const { id } = useParams()

  const [survey, setSurvey] = useState({
    title: "",
    slug: "",
    status: false,
    description: "",
    image: null,
    image_url: null,
    expire_date: "",
    questions: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onImageChoose = (ev) => {
    const file = ev.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setSurvey({
        ...survey,
        image: file,
        image_url: reader.result,
      })
      ev.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    setError("")

    const payload = { ...survey }
    if (payload.image) {
      payload.image = payload.image_url
    }
    delete payload.image_url

    let res = null
    if (id) {
      res = axiosClient.put(`/survey/${id}`, payload)
    } else {
      res = axiosClient.post("/survey", payload)
    }

    res
      .then((res) => {
        navigate("/surveys")
        if (id) {
          showToast("The survey was updated successfully")
        } else {
          showToast("The survey was created successfully")
        }
      })
      .catch((err) => {
        if (err && err.response) {
          setError(err.response.data.message || "An error occurred")
        }
        console.error(err)
      })
  }

  function onQuestionsUpdate(questions) {
    setSurvey({
      ...survey,
      questions,
    })
  }

  const onDelete = () => {
    if (!id) return

    if (window.confirm("Are you sure you want to delete this survey?")) {
      axiosClient
        .delete(`/survey/${id}`)
        .then(() => {
          navigate("/surveys")
          showToast("Survey deleted successfully")
        })
        .catch((err) => {
          console.error(err)
          showToast("Failed to delete survey")
        })
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      axiosClient
        .get(`/survey/${id}`)
        .then(({ data }) => {
          setSurvey(data.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
          setError("Failed to load survey")
        })
    }
  }, [id])

  return (
    <PageComponent
      title={!id ? "Create New Survey" : "Update Survey"}
      subtitle={!id ? "Design and configure your survey" : "Modify your survey settings and questions"}
      buttons={
        id && (
          <div className="flex gap-2">
            <TButton
              variant="outline"
              href={`/survey/public/${survey.slug}`}
              target="_blank"
              className="flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Public Link
            </TButton>
            <Button
              variant="outline"
              onClick={onDelete}
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )
      }
    >
      {loading && (
        <FormContainer>
          <CardContent className="p-6">
            <LoadingSkeleton>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </LoadingSkeleton>
          </CardContent>
        </FormContainer>
      )}

      {!loading && (
        <form onSubmit={onSubmit}>
          <FormContainer>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Survey Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Survey Image</Label>
                <ImageUploadContainer>
                  <ImagePreview>
                    {survey.image_url ? (
                      <img src={survey.image_url || "/placeholder.svg"} alt="Survey" />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                    <FileInput type="file" accept="image/*" onChange={onImageChoose} />
                  </ImagePreview>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      {survey.image_url ? "Change Image" : "Upload Image"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </ImageUploadContainer>
              </div>

              <FormGrid>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Survey Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={survey.title}
                    onChange={(ev) => setSurvey({ ...survey, title: ev.target.value })}
                    placeholder="Enter survey title"
                    required
                  />
                </div>

                {/* Expire Date */}
                <div className="space-y-2">
                  <Label htmlFor="expire_date">Expire Date *</Label>
                  <div className="relative">
                    <Input
                      id="expire_date"
                      type="date"
                      value={survey.expire_date}
                      onChange={(ev) => setSurvey({ ...survey, expire_date: ev.target.value })}
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Description */}
                <FullWidthField>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={survey.description || ""}
                      onChange={(ev) => setSurvey({ ...survey, description: ev.target.value })}
                      placeholder="Describe your survey purpose and instructions"
                      rows={4}
                    />
                  </div>
                </FullWidthField>

                {/* Active Status */}
                <FullWidthField>
                  <CheckboxContainer>
                    <Checkbox
                      id="status"
                      checked={survey.status}
                      onCheckedChange={(checked) => setSurvey({ ...survey, status: checked })}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="status" className="text-sm font-medium cursor-pointer">
                        Active Survey
                      </Label>
                      <p className="text-xs text-muted-foreground">Make this survey publicly available for responses</p>
                    </div>
                  </CheckboxContainer>
                </FullWidthField>
              </FormGrid>
            </CardContent>
          </FormContainer>

          {/* Questions Section */}
          <SurveyQuestions questions={survey.questions} onQuestionsUpdate={onQuestionsUpdate} />

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/surveys")}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              {id ? "Update Survey" : "Create Survey"}
            </Button>
          </div>
        </form>
      )}
    </PageComponent>
  )
}
