"use client"

import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import axiosClient from "../axios.js"
import SurveyListItem from "../components/SurveyListItem.jsx"
import TButton from "../components/core/TButton.jsx"
import PageComponent from "../components/PageComponent.jsx"
import PaginationLinks from "../components/PaginationLinks.jsx"
import { useStateContext } from "../contexts/ContextProvider.jsx"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import styled from "styled-components"

const SurveysContainer = styled.div`
  space-y: 2rem;
`

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: hsl(215.4 16.3% 46.9%);
    pointer-events: none;
  }
  
  input {
    padding-left: 2.5rem;
  }
`

const SurveysGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const EmptyState = styled(Card)`
  text-align: center;
  padding: 3rem 2rem;
  border: 2px dashed hsl(214.3 31.8% 91.4%);
  background-color: hsl(210 40% 98%);
`

const LoadingGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export default function Surveys() {
  const { showToast } = useStateContext()
  const [surveys, setSurveys] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const onDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this survey? This action cannot be undone.")) {
      axiosClient
        .delete(`/survey/${id}`)
        .then(() => {
          getSurveys()
          showToast("Survey deleted successfully. All associated data has been removed.", "success")
        })
        .catch((err) => {
          console.error(err)
          showToast("Failed to delete survey. Please try again later.", "error")
        })
    }
  }

  const onPageClick = (link) => {
    getSurveys(link.url)
  }

  const getSurveys = (url) => {
    url = url || "/survey"
    setLoading(true)
    axiosClient
      .get(url)
      .then(({ data }) => {
        setSurveys(data.data)
        setMeta(data.meta)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
        showToast("Failed to load surveys. Please refresh the page.", "error")
      })
  }

  const handleSearch = (ev) => {
    ev.preventDefault()
    if (searchTerm.trim()) {
      setLoading(true)
      axiosClient
        .get(`/survey?search=${encodeURIComponent(searchTerm)}`)
        .then(({ data }) => {
          setSurveys(data.data)
          setMeta(data.meta)
          setLoading(false)
          if (data.data.length === 0) {
            showToast(`No surveys found for "${searchTerm}"`, "warning")
          }
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
          showToast("Search failed. Please try again.", "error")
        })
    } else {
      getSurveys()
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    getSurveys()
  }

  useEffect(() => {
    getSurveys()
  }, [])

  return (
    <PageComponent
      title="Surveys"
      subtitle="Create, manage, and analyze your surveys"
      buttons={
        <TButton color="green" to="/surveys/create">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New Survey
        </TButton>
      }
    >
      <SurveysContainer>
        {/* Search */}
        <SearchContainer>
          <SearchInput>
            <MagnifyingGlassIcon className="h-4 w-4 search-icon" />
            <Input
              type="text"
              placeholder="Search surveys by title or description..."
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              onKeyPress={(ev) => ev.key === "Enter" && handleSearch(ev)}
            />
          </SearchInput>
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
          {searchTerm && (
            <Button variant="outline" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </SearchContainer>

        {/* Loading State */}
        {loading && (
          <LoadingGrid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </LoadingGrid>
        )}

        {/* Surveys Grid */}
        {!loading && surveys.length > 0 && (
          <SurveysGrid>
            {surveys.map((survey) => (
              <SurveyListItem key={survey.id} survey={survey} onDeleteClick={onDeleteClick} />
            ))}
          </SurveysGrid>
        )}

        {/* Empty State */}
        {!loading && surveys.length === 0 && (
          <EmptyState>
            <CardContent>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No surveys found" : "No surveys yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? `We couldn't find any surveys matching "${searchTerm}". Try adjusting your search terms.`
                    : "Get started by creating your first survey to collect valuable feedback and insights."}
                </p>
                {!searchTerm && (
                  <TButton color="green" to="/surveys/create">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Survey
                  </TButton>
                )}
                {searchTerm && (
                  <Button variant="outline" onClick={clearSearch}>
                    View All Surveys
                  </Button>
                )}
              </div>
            </CardContent>
          </EmptyState>
        )}

        {/* Pagination */}
        {!loading && surveys.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
      </SurveysContainer>
    </PageComponent>
  )
}
