import styled from "styled-components"

const PageContainer = styled.div`
  background-color: hsl(210 40% 98%);
  min-height: calc(100vh - 4rem);
`

const PageHeader = styled.header`
  background: white;
  border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1.5rem 2rem;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: hsl(222.2 47.4% 11.2%);
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: hsl(215.4 16.3% 46.9%);
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`

const TitleSection = styled.div`
  flex: 1;
`

const ButtonSection = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-start;
  }
`

const MainContent = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1.5rem 2rem;
  }
`

export default function PageComponent({ title, subtitle, buttons = "", children }) {
  return (
    <PageContainer>
      <PageHeader>
        <HeaderContent>
          <TitleSection>
            <PageTitle>{title}</PageTitle>
            {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
          </TitleSection>
          {buttons && <ButtonSection>{buttons}</ButtonSection>}
        </HeaderContent>
      </PageHeader>
      <MainContent>{children}</MainContent>
    </PageContainer>
  )
}
