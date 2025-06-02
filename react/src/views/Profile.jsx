"use client";

import { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import styled from "styled-components";

//
// Inline SVG icons (we removed the old Heroicons imports for them)
//
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6M18.364 2.636a2.5 2.5 0 113.536 3.536l-12 12a2 2 0 01-1.414.586H6v-2.121a2 2 0 01.586-1.415l12-12z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
    />
  </svg>
);

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l1.34-2.68A2 2 0 016.09 4h11.82a2 2 0 011.75 1.32L21 8m-9 4a4 4 0 110-8 4 4 0 010 8zm8 8H5a2 2 0 01-2-2V8h18v10a2 2 0 01-2 2z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7M5 5h14v14H5z"
    />
  </svg>
);

//
// Styled components
//
const ProfileContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileHeader = styled(Card)`
  background: linear-gradient(
    135deg,
    hsl(222.2 47.4% 11.2%) 0%,
    hsl(224.4 47.4% 15.6%) 100%
  );
  color: white;
  border: none;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
`;

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
    width: 100%;
    height: 100%;
  }
`;

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
`;

const InfoCard = styled(Card)`
  background: white;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  transition: all 0.2s ease;

  &:hover {
    border-color: hsl(213.3 31.8% 83.2%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FullWidthField = styled.div`
  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

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
`;

const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default function Profile() {
  const { currentUser, setCurrentUser } = useStateContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  function fetchUserProfile() {
    setLoading(true);
    axiosClient
      .get("/user")
      .then(({ data }) => {
        console.log("Fetched user data:", data);

        setCurrentUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        // Reset avatar preview when fetching user data
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching /user:", err);
        setError("Failed to load profile information", err.message);
        setLoading(false);
        toast.error("Loading Failed", {
          description: "Unable to load your profile. Please refresh the page.",
        });
      });
  }

  function handleInputChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.new_password) {
      payload.current_password = formData.current_password;
      payload.new_password = formData.new_password;
      payload.new_password_confirmation = formData.new_password_confirmation;
    }

    axiosClient
      .put("/user", payload)
      .then(({ data }) => {
        // data.user is the updated user object
        setCurrentUser(data.user);
        setIsEditing(false);
        setFormData((prev) => ({
          ...prev,
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        }));
        toast.success("Profile Updated!", {
          description: "Your profile information has been saved successfully.",
        });
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        if (err.response && err.response.data.errors) {
          const errs = Object.values(err.response.data.errors).flat();
          setError(errs.join(". "));
        } else {
          setError("Failed to update profile. Please try again.");
        }
        toast.error("Update Failed", {
          description:
            "Unable to save your changes. Please check your information and try again.",
        });
      })
      .finally(() => {
        toast.success("Profile Updated!", {
          description: "Your profile information has been updated successfully.",
        });
        setSaving(false);
      });
  }

  function handleCancel() {
    setIsEditing(false);
    setError("");
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    }
  }

  function handleAvatarChange(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;

    // 1) Build a FormData for upload
    const uploadData = new FormData();
    uploadData.append("avatar", file);

    // Show a loading toast
    const loadingToast = toast.loading("Uploading profile picture...");

    axiosClient
      .post("/user/avatar", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        // data.user contains the updated user object with new avatar_url
        setCurrentUser(data.user);
        toast.success("Avatar Updated!", {
          description: "Your profile picture has been updated successfully.",
        });
      })
      .catch((err) => {
        console.error("Error uploading avatar:", err);
        toast.error("Upload Failed", {
          description:
            "Unable to update your profile picture. Please try again.",
        });
      })
      .finally(() => {
        toast.dismiss(loadingToast);
      });
  }

  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // While loading, show skeletons
  // ───────────────────────────────────────────────────────────────────────────
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
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // If there was an error AND currentUser is still null/undefined, show an alert
  // ───────────────────────────────────────────────────────────────────────────
  if (error && !currentUser) {
    return (
      <PageComponent title="Profile">
        <ProfileContainer>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </ProfileContainer>
      </PageComponent>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Main render: Profile header + either view mode or edit mode
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <PageComponent
      title="My Profile"
      subtitle="Manage your account settings and personal information"
      buttons={
        !isEditing &&
        currentUser && (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <EditIcon />
            Edit Profile
          </Button>
        )
      }
    >
      <ProfileContainer>
        {/* ─────────── Profile Header ─────────── */}
        <ProfileHeader>
          <CardContent className="p-8 text-center">
            <AvatarContainer>
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage
                  src={
                    currentUser.avatar_url &&
                    "http://localhost:8000/storage/" + currentUser.avatar_url
                  }
                  alt={currentUser?.name}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="text-lg font-semibold bg-white/20 text-white">
                  {getInitials(currentUser?.name)}
                </AvatarFallback>
              </Avatar>
              <AvatarUpload>
                <CameraIcon />
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={handleAvatarChange}
                  aria-label="Upload profile picture"
                />
              </AvatarUpload>
            </AvatarContainer>
            <UserInfo>
              <h1>{currentUser?.name}</h1>
              <p>{currentUser?.email}</p>
            </UserInfo>
          </CardContent>
        </ProfileHeader>

        {/* ─────────── Profile Information or Edit Form ─────────── */}
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
                    <div className="value">
                      {currentUser?.name || "Not provided"}
                    </div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <MailIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Email Address</div>
                    <div className="value">
                      {currentUser?.email || "Not provided"}
                    </div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <CalendarIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Member Since</div>
                    <div className="value">
                      {currentUser?.created_at
                        ? formatDate(currentUser.created_at)
                        : "Unknown"}
                    </div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <CalendarIcon className="h-5 w-5 icon" />
                  <div className="content">
                    <div className="label">Last Updated</div>
                    <div className="value">
                      {currentUser?.updated_at
                        ? formatDate(currentUser.updated_at)
                        : "Unknown"}
                    </div>
                  </div>
                </InfoItem>
              </div>
            </CardContent>
          </InfoCard>
        ) : (
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
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(ev) =>
                        handleInputChange("name", ev.target.value)
                      }
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
                      onChange={(ev) =>
                        handleInputChange("email", ev.target.value)
                      }
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Change Password Section */}
                  <FullWidthField>
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Change Password (Optional)
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">
                            Current Password
                          </Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={formData.current_password}
                            onChange={(ev) =>
                              handleInputChange(
                                "current_password",
                                ev.target.value
                              )
                            }
                            placeholder="Enter current password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={formData.new_password}
                            onChange={(ev) =>
                              handleInputChange("new_password", ev.target.value)
                            }
                            placeholder="Enter new password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password_confirmation">
                            Confirm New Password
                          </Label>
                          <Input
                            id="new_password_confirmation"
                            type="password"
                            value={formData.new_password_confirmation}
                            onChange={(ev) =>
                              handleInputChange(
                                "new_password_confirmation",
                                ev.target.value
                              )
                            }
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </FullWidthField>
                </FormGrid>

                <ActionButtons>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <XIcon />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <SaveIcon />
                        Save Changes
                      </>
                    )}
                  </Button>
                </ActionButtons>
              </form>
            </CardContent>
          </InfoCard>
        )}
      </ProfileContainer>
    </PageComponent>
  );
}
