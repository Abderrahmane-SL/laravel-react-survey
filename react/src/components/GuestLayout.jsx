import { Navigate, Outlet } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "./ThemeToggle"
import styled from "styled-components"

const GuestContainer = styled.div`
  min-height: 100vh;
  background: hsl(var(--background));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  transition: background-color 0.3s ease;
  
  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }
`

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 28rem;

  & > *:not(:last-child) {
    margin-bottom: 2rem;
  }
`

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`

const ThemeToggleContainer = styled.div`
  position: absolute;
  top: -1rem;
  right: -1rem;
`

const Logo = styled.img`
  height: 3rem;
  width: auto;
  margin: 0 auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`

const StyledCard = styled(Card)`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  color: hsl(var(--card-foreground));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  overflow: hidden;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  
  .dark & {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const BrandText = styled.div`
  text-align: center;
  margin-top: 1rem;
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }
`

export default function GuestLayout() {
  const { userToken } = useStateContext()

  if (userToken) {
    return <Navigate to="/" />
  }

  return (
    <GuestContainer>
      <ContentWrapper>
        <LogoContainer>
          <ThemeToggleContainer>
            <ThemeToggle />
          </ThemeToggleContainer>
          <Logo src="logodark.png" alt="Surveys App" />
          <BrandText>
            <h1>Surveys App</h1>
            <p>Create and manage surveys with ease</p>
          </BrandText>
        </LogoContainer>

        <StyledCard>
          <CardContent className="p-8">
            <Outlet />
          </CardContent>
        </StyledCard>
      </ContentWrapper>
    </GuestContainer>
  )
}
