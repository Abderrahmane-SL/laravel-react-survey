import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ContextProvider } from "./contexts/ContextProvider";
import "./index.css";
import router from "./router.jsx";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="surveys-ui-theme">
      <ContextProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <RouterProvider router={router} />
        </div>
      </ContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
