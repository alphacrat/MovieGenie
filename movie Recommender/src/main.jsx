import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Changed from BrowserRouter
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);