import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

import "./App.css";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// console.log("VITE ENV:", import.meta.env);
console.log("GOOGLE CLIENT ID:", clientId);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={clientId}>
            <App />
          </GoogleOAuthProvider>

          <ToastContainer
            position="top-right"
            autoClose={2500}
            theme="colored"
          />
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
);