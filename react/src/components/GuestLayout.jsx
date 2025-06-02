import { Navigate, Outlet } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import { Card, CardContent } from "@/components/ui/card"
import styled from "styled-components"

const GuestContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(214.3 31.8% 91.4%) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  
  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }
`

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const Logo = styled.img`
  height: 3rem;
  width: auto;
  margin: 0 auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 640px) {
    height: 2.5rem;
  }
`


const StyledCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  overflow: hidden;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  
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
    color: hsl(222.2 47.4% 11.2%);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: hsl(215.4 16.3% 46.9%);
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
