"use client"

import { useEffect } from "react"
import { Disclosure } from "@headlessui/react"
import { Bars3Icon, BellIcon, XMarkIcon, HomeIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import axiosClient from "../axios"
import Toast from "./Toast"
import { ThemeToggle } from "./ThemeToggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import styled from "styled-components"

const MainContainer = styled.div`
  min-height: 100vh;
  background-color: hsl(var(--background));
  transition: background-color 0.3s ease;
`

const NavigationBar = styled.nav`
  background: hsl(var(--card));
  border-bottom: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  .dark & {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3);
  }
`

const Logo = styled.img`
  height: 6rem;
  width: 6rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  color: hsl(var(--muted-foreground));
  text-decoration: none;
  
  &:hover {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
    transform: translateY(-1px);
  }
  
  &.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`

const MobileNavItem = styled(NavLink)`
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-left: 4px solid hsl(var(--primary));
  }
  
  &:not(.active) {
    color: hsl(var(--muted-foreground));
    border-left: 4px solid transparent;
    
    &:hover {
      background-color: hsl(var(--accent));
      border-left-color: hsl(var(--border));
      color: hsl(var(--accent-foreground));
    }
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted));
`

const UserDetails = styled.div`
  flex: 1;
  
  .name {
    font-weight: 600;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
  }
  
  .email {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.125rem;
  }
`

const navigation = [
  { name: "Dashboard", to: "/", icon: HomeIcon },
  { name: "Surveys", to: "/surveys", icon: DocumentTextIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function DefaultLayout() {
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext()

  const logout = (ev) => {
    ev.preventDefault()
    axiosClient.post("/logout").then((res) => {
      setCurrentUser({})
      setUserToken(null)
    })
  }

  useEffect(() => {
    if (userToken) {
      axiosClient.get("/me").then(({ data }) => {
        setCurrentUser(data)
      })
    }
  }, [userToken])

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!userToken) {
    return <Navigate to="login" />
  }

  return (
    <MainContainer>
      <Disclosure as={NavigationBar}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Logo src="logo.png" alt="Surveys App" />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-2">
                      {navigation.map((item) => (
                        <NavItem key={item.name} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                          <item.icon />
                          {item.name}
                        </NavItem>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6 gap-3">
                    <span>

                      <ThemeToggle />
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-white hover:bg-white/10"
                          >
                            <Avatar className="h-8 w-8">
                              <img
                                src={
                                  currentUser.avatar_url &&
                                  "http://localhost:8000/storage/" +
                                    currentUser.avatar_url
                                }
                                alt={currentUser?.name}
                                className="object-cover w-full h-full"
                              />
                              <AvatarFallback className="text-lg font-semibold bg-white/20 text-white">
                                {getInitials(currentUser?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="hidden lg:block text-sm font-medium">
                              {currentUser.name}
                            </span>
                          </Button>
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="font-medium">{currentUser.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <NavLink to="/profile" className="w-full">
                            Profile Settings
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600">
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden bg-card border-t border-border">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <MobileNavItem key={item.name} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </div>
                  </MobileNavItem>
                ))}
              </div>

              <UserInfo>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <UserDetails>
                  <div className="name">{currentUser.name}</div>
                  <div className="email">{currentUser.email}</div>
                </UserDetails>
                <div className="flex gap-2">
                  <ThemeToggle />
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-5 w-5" />
                  </Button>
                </div>
              </UserInfo>

              <div className="mt-3 space-y-1 px-2 pb-3">
                <Disclosure.Button
                  as="button"
                  onClick={logout}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Outlet />
      <Toast />
    </MainContainer>
  )
}
