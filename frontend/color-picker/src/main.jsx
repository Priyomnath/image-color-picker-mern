// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// //13/07/2026
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import App from "./App";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <App />
//     <ToastContainer position="top-right" autoClose={2500} theme="colored" />
//   </BrowserRouter>,
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";

//22/07/2026 {time: 10:38 PM}
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <ThemeProvider>
        <App />
        <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      </ThemeProvider>
    </HelmetProvider>
  </BrowserRouter>,
);
