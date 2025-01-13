// src/index.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from './store'; // Import du store
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux"; // Import du Provider
import "./styles/style.scss"; // Importation des styles SCSS

ReactDOM.createRoot(
  document.getElementById("root") || document.createElement("div")
).render(
  <Provider store={store}> {/* Entourer l'application avec Provider */}
    <Router>
      <App />
    </Router>
  </Provider>
);
