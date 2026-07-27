import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

// App CSS
import "./App.css";

// Theme Context
import { ThemeProvider } from "./context/ThemeContext";

// Auth Context
import { AuthProvider } from "./context/AuthContext";

// Helmet
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={2500}
            theme="colored"
          />
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>,
);