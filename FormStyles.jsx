import styled from "styled-components"
import { Form as ShadcnForm } from "@/components/ui/form"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Link } from "react-router-dom"

// Form components
export const StyledForm = styled(ShadcnForm)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ErrorContainer = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: var(--color-red-100);
  color: var(--destructive);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`

export const StyledFormItem = styled.div`
  margin-bottom: 1.5rem;

  & label {
    font-weight: 600;
    margin-bottom: 0.2rem;
    display: inline-block;
  }
`

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0.5rem 0 1.5rem;
`

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500 !important;
`

export const ForgotPasswordLink = styled(Link)`
  font-size: 0.875rem;
  color: var(--color-brand-400);
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

export const SubmitButton = styled(ShadcnButton)`
  width: 100%;
  margin-top: 0.5rem;
  height: 2.75rem;
  font-weight: 600;
  font-size: 1rem;
`

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: var(--color-grey-300);
  }

  & span {
    padding: 0 1rem;
    font-size: 14px;
    color: var(--color-grey-500);
    font-weight: 500;
  }
`

export const SocialButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const FormFooter = styled.div`
  text-align: center;
  font-size: 0.875rem;
  margin-top: 2rem;
  font-weight: 500;

  & a {
    color: var(--color-brand-400);
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`

// Password input wrapper for show/hide functionality
export const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
  
  & button {
    position: absolute;
    right: 10px;
    top: 42%;
    transform: translateY(-50%);
    background: transparent;
    color: var(--color-grey-500);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    padding: 0;
  }
  
  & button:hover {
    background-color: transparent;
  }
`

