"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import styled from "styled-components"

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid hsl(214.3 31.8% 91.4%);
  background-color: white;
  padding: 1rem 1.5rem;
  margin-top: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
  }
`

const ResultsText = styled.p`
  font-size: 0.875rem;
  color: hsl(215.4 16.3% 46.9%);
  margin: 0;
  
  .font-medium {
    font-weight: 600;
    color: hsl(222.2 47.4% 11.2%);
  }
`

const MobilePaginationContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  
  @media (min-width: 640px) {
    display: none;
  }
`

const DesktopPaginationContainer = styled.div`
  display: none;
  
  @media (min-width: 640px) {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  }
`

const StyledPaginationLink = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: white;
  color: hsl(215.4 16.3% 46.9%);
  
  &:hover {
    background-color: hsl(210 40% 96.1%);
    border-color: hsl(213.3 31.8% 83.2%);
  }
  
  &:focus {
    z-index: 20;
    outline: none;
    ring: 2px;
    ring-color: hsl(218.2 39.3% 57.1%);
  }
  
  &.active {
    z-index: 10;
    background-color: hsl(218.2 39.3% 57.1%);
    border-color: hsl(218.2 39.3% 57.1%);
    color: white;
  }
  
  &.first {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }
  
  &.last {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default function PaginationLinks({ meta, onPageClick }) {
  function onClick(ev, link) {
    ev.preventDefault()
    if (!link.url) {
      return
    }
    onPageClick(link)
  }

  if (!meta || !meta.links) {
    return null
  }

  const prevLink = meta.links[0]
  const nextLink = meta.links[meta.links.length - 1]

  return (
    <PaginationContainer>
      {/* Mobile Pagination */}
      <MobilePaginationContainer>
        <Button
          variant="outline"
          onClick={(ev) => onClick(ev, prevLink)}
          disabled={!prevLink.url}
          className="flex items-center gap-2"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={(ev) => onClick(ev, nextLink)}
          disabled={!nextLink.url}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </MobilePaginationContainer>

      {/* Desktop Pagination */}
      <DesktopPaginationContainer>
        <div>
          <ResultsText>
            Showing <span className="font-medium">{meta.from}</span> to <span className="font-medium">{meta.to}</span>{" "}
            of <span className="font-medium">{meta.total}</span> results
          </ResultsText>
        </div>

        <div>
          {meta.total > meta.per_page && (
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {meta.links.map((link, ind) => (
                <StyledPaginationLink
                  key={ind}
                  onClick={(ev) => onClick(ev, link)}
                  disabled={!link.url}
                  className={`
                    ${ind === 0 ? "first" : ""}
                    ${ind === meta.links.length - 1 ? "last" : ""}
                    ${link.active ? "active" : ""}
                  `}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          )}
        </div>
      </DesktopPaginationContainer>
    </PaginationContainer>
  )
}
