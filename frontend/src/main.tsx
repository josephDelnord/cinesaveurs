// src/index.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/style.scss"; // Importation des styles SCSS
ReactDOM.createRoot(
  document.getElementById("root") || document.createElement("div")
).render(
  <Router>
    <App />
  </Router>
);
