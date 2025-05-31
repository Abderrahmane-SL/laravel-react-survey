"use client"

import { Link } from "react-router-dom"
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import axiosClient from "../axios.js"
import { useStateContext } from "../contexts/ContextProvider.jsx"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import styled from "styled-components"

const SignupContainer = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const SignupCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
`

const PasswordInputWrapper = styled.div`
  position: relative;
  
  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: hsl(215.4 16.3% 46.9%);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: hsl(222.2 47.4% 11.2%);
    }
  }
`

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
`

const LinkText = styled(Link)`
  color: hsl(218.2 39.3% 57.1%);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`

export default function Signup() {
  const { setCurrentUser, setUserToken } = useStateContext()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    setError("")
    setLoading(true)

    axiosClient
      .post("/signup", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      })
      .then(({ data }) => {
        setCurrentUser(data.user)
        setUserToken(data.token)
      })
      .catch((error) => {
        if (error.response) {
          const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], [])
          setError(finalErrors.join(". "))
        } else {
          setError("An unexpected error occurred. Please try again.")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <SignupContainer>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-sm text-muted-foreground">Join us to start creating amazing surveys</p>
      </div>

      <SignupCard>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <FormGrid>
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name *</Label>
                <Input
                  id="full-name"
                  type="text"
                  value={formData.fullName}
                  onChange={(ev) => handleInputChange("fullName", ev.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(ev) => handleInputChange("email", ev.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <PasswordInputWrapper>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(ev) => handleInputChange("password", ev.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </PasswordInputWrapper>
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password-confirmation">Confirm Password *</Label>
                <PasswordInputWrapper>
                  <Input
                    id="password-confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={formData.passwordConfirmation}
                    onChange={(ev) => handleInputChange("passwordConfirmation", ev.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </PasswordInputWrapper>
              </div>
            </FormGrid>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  Create Account
                </div>
              )}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account? <LinkText to="/login">Sign in here</LinkText>
          </div>
        </CardContent>
      </SignupCard>
    </SignupContainer>
  )
}
