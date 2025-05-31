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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import styled from "styled-components"

const LoginContainer = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const LoginCard = styled(Card)`
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

const FormActions = styled.div`
  display: flex;
  items-center;
  justify-content: space-between;
  margin: 1rem 0;
`

const CheckboxContainer = styled.div`
  display: flex;
  items-center;
  gap: 0.5rem;
`

const LinkText = styled(Link)`
  color: hsl(218.2 39.3% 57.1%);
  font-weight: 500;
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`

export default function Login() {
  const { setCurrentUser, setUserToken } = useStateContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = (ev) => {
    ev.preventDefault()
    setError("")
    setLoading(true)

    axiosClient
      .post("/login", {
        email,
        password,
        remember,
      })
      .then(({ data }) => {
        setCurrentUser(data.user)
        setUserToken(data.token)
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || "Invalid credentials")
        } else {
          setError("An unexpected error occurred. Please try again.")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <LoginContainer>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <LoginCard>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInputWrapper>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </PasswordInputWrapper>
            </div>

            <FormActions>
              <CheckboxContainer>
                <Checkbox id="remember" checked={remember} onCheckedChange={setRemember} />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </CheckboxContainer>
              <LinkText to="/forgot-password">Forgot password?</LinkText>
            </FormActions>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account? <LinkText to="/signup">Create one here</LinkText>
          </div>
        </CardContent>
      </LoginCard>
    </LoginContainer>
  )
}
