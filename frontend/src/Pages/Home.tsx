import type React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="title-main">
          Bienvenue dans l'univers de{" "}
          <span className="highlight">Ciné Saveurs</span>
        </h1>
        <p className="hero-description">
          Nous vous invitons à explorer des centaines de recettes inspirées par
          vos films et séries préférés.
        </p>
        <p className="hero-description">Explorez, créez et partagez !</p>
        <Link to="/register" className="explore-button">
          Inscrivez-vous
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
