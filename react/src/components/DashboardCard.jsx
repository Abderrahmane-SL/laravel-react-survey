import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import styled from "styled-components"

const StyledCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border-color: hsl(213.3 31.8% 83.2%);
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
    flex: 1;
  }
`

const CardTitleStyled = styled(CardTitle)`
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(215.4 16.3% 46.9%);
  margin-bottom: 1rem;
  text-align: center;
`

const CardContentWrapper = styled(CardContent)`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0;
`

export default function DashboardCard({ title, children, style = {}, className = "" }) {
  return (
    <StyledCard className={`h-full ${className}`} style={style}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitleStyled>{title}</CardTitleStyled>
        </CardHeader>
      )}
      <CardContentWrapper className="card-content">{children}</CardContentWrapper>
    </StyledCard>
  )
}
