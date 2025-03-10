import React from "react";
import ReactDOM from "react-dom/client";  // ✅ ใช้ createRoot() แทน
import App from "./App";
import "@fontsource/poppins";
import { CssBaseline } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
