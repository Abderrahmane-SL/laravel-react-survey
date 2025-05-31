"use client"

import { useContext } from "react"
import { useState } from "react"
import { createContext } from "react"

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  surveys: [],
  questionTypes: [],
  toast: {
    message: null,
    show: false,
    type: "default",
  },
  setCurrentUser: () => {},
  setUserToken: () => {},
  showToast: () => {},
})

const tmpSurveys = [
  // ... existing survey data
]

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})
  const [userToken, _setUserToken] = useState(localStorage.getItem("TOKEN") || "")
  const [surveys, setSurveys] = useState(tmpSurveys)
  const [questionTypes] = useState(["text", "select", "radio", "checkbox", "textarea"])
  const [toast, setToast] = useState({ message: "", show: false, type: "default" })

  const setUserToken = (token) => {
    if (token) {
      localStorage.setItem("TOKEN", token)
    } else {
      localStorage.removeItem("TOKEN")
    }
    _setUserToken(token)
  }

  const showToast = (message, type = "default") => {
    setToast({ message, show: true, type })
    setTimeout(() => {
      setToast({ message: "", show: false, type: "default" })
    }, 5000)
  }

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
        surveys,
        setSurveys,
        questionTypes,
        toast,
        showToast,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
