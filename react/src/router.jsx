import { createBrowserRouter, Navigate } from "react-router-dom"
import Dashboard from "./views/Dashboard.jsx"
import Surveys from "./views/Surveys.jsx"
import Login from "./views/Login.jsx"
import Signup from "./views/Signup.jsx"
import Profile from "./views/Profile.jsx"
import GuestLayout from "./components/GuestLayout.jsx"
import DefaultLayout from "./components/DefaultLayout.jsx"
import SurveyView from "./views/SurveyView.jsx"
import SurveyPublicView from "./views/SurveyPublicView.jsx"
import SurveyResults from "./views/SurveyResults.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/surveys",
        element: <Surveys />,
      },
      {
        path: "/surveys/create",
        element: <SurveyView />,
      },
      {
        path: "/surveys/:id",
        element: <SurveyView />,
      },
      {
        path: "/survey/results/:id",
        element: <SurveyResults />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/survey/public/:slug",
    element: <SurveyPublicView />,
  },
  {
    path: "/view/survey/:slug",
    element: <SurveyPublicView />,
  },
])

export default router
