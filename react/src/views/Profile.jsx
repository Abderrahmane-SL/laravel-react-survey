"use client"

import { useState, useEffect } from "react"
import { useStateContext } from "../contexts/ContextProvider"
import PageComponent from "../components/PageComponent"
import axiosClient from "../axios.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { UserIcon } from "@heroicons/react/24/outline"
import styled from "styled-components"
import { CalendarIcon, CameraIcon, EditIcon, MailIcon, SaveIcon, XIcon } from "lucide-react"

const ProfileContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  space-y: 2rem;
`

const ProfileHeader = styled(Card)`
  background: linear-gradient(135deg, hsl(222.2 47.4% 11.2%) 0%, hsl(224.4 47.4% 15.6%) 100%);
  color: white;
  border: none;
  margin-bottom: 2rem;
`

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
`

const AvatarUpload = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: hsl(218.2 39.3% 57.1%);
  border: 2px solid white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: hsl(218.2 39.3% 47.1%);
    transform: scale(1.1);
  }
  
  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`

const UserInfo = styled.div`
  text-align: center;
  
  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.9;
    font-size: 1rem;
  }
`

const InfoCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  border-radius: 0.5rem;
  background-color: hsl(210 40% 98%);
  
  .icon {
    color: hsl(218.2 39.3% 57.1%);
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 0.75rem;
      font-weight: 600;
      color: hsl(215.4 16.3% 46.9%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    
    .value {
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(222.2 47.4% 11.2%);
    }
  }
`

const LoadingSkeleton = styled.div`
  space-y: 1.5rem;
`

export default function Profile() {
  const { currentUser, setCurrentUser, showToast } = useStateContext()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = () => {
    setLoading(true)
    axiosClient
      .get("/me")
      .then(({ data }) => {
        setCurrentUser(data)
        setFormData({
          name: data.name || "",
          email: data.email || "",
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        })
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load profile information")
        setLoading(false)
      })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    setError("")
    setSaving(true)

    // Prepare payload - only include password fields if new password is provided
    const payload = {
      name: formData.name,
      email: formData.email,
    }

    if (formData.new_password) {
      payload.current_password = formData.current_password
      payload.new_password = formData.new_password
      payload.new_password_confirmation = formData.new_password_confirmation
    }

    axiosClient
      .put("/profile", payload)
      .then(({ data }) => {
        setCurrentUser(data.user)
        setIsEditing(false)
        setFormData({
          ...formData,
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        })
        showToast("Profile updated successfully! Your changes have been saved.", "success")
      })
      .catch((err) => {
        if (err.response && err.response.data.errors) {
          const errors = Object.values(err.response.data.errors).flat()
          setError(errors.join(". "))
        } else {
          setError("Failed to update profile. Please try again.")
        }
        showToast("Failed to update profile. Please check your information and try again.", "error")
      })
      .finally(() => {
        setSaving(false)
      })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError("")
    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    })
  }

  const handleAvatarChange = (ev) => {
    const file = ev.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    axiosClient
      .post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        setCurrentUser(data.user)
        showToast("Profile picture updated successfully!", "success")
      })
      .catch((err) => {
        console.error(err)
        showToast("Failed to update profile picture. Please try again.", "error")
      })
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <PageComponent title="Profile">
        <ProfileContainer>
          <LoadingSkeleton>
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </LoadingSkeleton>
        </ProfileContainer>
      </PageComponent>
    )
  }

  return (
    <PageComponent
      title="My Profile"
      subtitle="Manage your account settings and personal information"
      buttons={
        !isEditing && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <EditIcon className="h-4 w-4" />
            Edit Profile
          </Button>
        )
      }
    >
      <ProfileContainer>
        {/* Profile Header */}
        <ProfileHeader>
          <CardContent className="p-8 text-center">
            <AvatarContainer>
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={currentUser.avatar_url || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="text-lg font-semibold bg-white/20 text-white">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <AvatarUpload>
                <CameraIcon className="h-4 w-4 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </AvatarUpload>
            </AvatarContainer>
            <UserInfo>
              <h1>{currentUser.name}</h1>
              <p>{currentUser.email}</p>
            </UserInfo>
          </CardContent>
        </ProfileHeader>

        {/* Profile Information */}
        {!isEditing ? (
          <InfoCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem>
                  <UserIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Full Name</div>
                    <div className="value">{currentUser.name || "Not provided"}</div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <MailIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Email Address</div>
                    <div className="value">{currentUser.email || "Not provided"}</div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <CalendarIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Member Since</div>
                    <div className="value">
                      {currentUser.created_at ? formatDate(currentUser.created_at) : "Unknown"}
                    </div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <CalendarIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Last Updated</div>
                    <div className="value">
                      {currentUser.updated_at ? formatDate(currentUser.updated_at) : "Unknown"}
                    </div>
                  </div>
                </InfoItem>
              </div>
            </CardContent>
          </InfoCard>
        ) : (
          /* Edit Profile Form */
          <InfoCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EditIcon className="h-5 w-5" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <FormGrid>
                  {/* Basic Information */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(ev) => handleInputChange("name", ev.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

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

                  {/* Password Change Section */}
                  <FullWidthField>
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4">Change Password (Optional)</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">Current Password</Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={formData.current_password}
                            onChange={(ev) => handleInputChange("current_password", ev.target.value)}
                            placeholder="Enter current password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={formData.new_password}
                            onChange={(ev) => handleInputChange("new_password", ev.target.value)}
                            placeholder="Enter new password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                          <Input
                            id="new_password_confirmation"
                            type="password"
                            value={formData.new_password_confirmation}
                            onChange={(ev) => handleInputChange("new_password_confirmation", ev.target.value)}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </FullWidthField>
                </FormGrid>

                <ActionButtons>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SaveIcon className="h-4 w-4" />
                        Save Changes
                      </div>
                    )}
                  </Button>
                </ActionButtons>
              </form>
            </CardContent>
          </InfoCard>
        )}
      </ProfileContainer>
    </PageComponent>
  )
}
