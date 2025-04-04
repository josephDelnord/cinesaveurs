import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const userPseudo = localStorage.getItem("pseudo") || "Utilisateur";
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  // Fonction pour gérer l'ouverture/fermeture du menu
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // Fonction pour fermer le menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pseudo");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setTimeout(() => navigate("/login"), 100); // Ajout d'un léger délai
  };

  // Lien de profil en fonction du rôle de l'utilisateur
  const profileLink = userRole === "admin" ? "/admin/profile" : "/profile";

  // Gestion de la fermeture du menu si l'utilisateur clique en dehors
  useEffect(() => {
    const closeMenuOnClickOutside = (e: MouseEvent) => {
      if (
        !(e.target as Element).closest("#nav") &&
        !(e.target as Element).closest(".burger-menu")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", closeMenuOnClickOutside);
    return () => document.removeEventListener("click", closeMenuOnClickOutside);
  }, []);

  // Rendre les liens pour un utilisateur authentifié
  const renderAuthLinks = () => (
    <>
      <li>
        <Link to={profileLink} onClick={closeMenu}>
          {userPseudo}
        </Link>
      </li>
      <li>
        <Link to="/" onClick={handleLogout}>
          Déconnexion
        </Link>
      </li>
    </>
  );

  // Rendre les liens pour un utilisateur non authentifié
  const renderGuestLinks = () => (
    <>
      <li>
        <Link to="/register" onClick={closeMenu}>
          Inscription
        </Link>
      </li>
      <li>
        <Link to="/login" onClick={closeMenu}>
          Connexion
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={closeMenu}>
          A propos
        </Link>
      </li>
    </>
  );

  return (
    <div id="header">
      <Link to="/">
        <img id="logo-header" src="/img/logo.png" alt="logo" />
      </Link>

      <nav id="nav" className={isMenuOpen ? "open" : ""}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/recipes" onClick={closeMenu}>
              Recettes
            </Link>
          </li>

          {!isAuthenticated ? renderGuestLinks() : renderAuthLinks()}

          {userRole === "admin" && (
            <li>
              <Link to="/admin/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <button
        type="button"
        className={`burger-menu ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
        onKeyUp={(e) => {
          if (e.key === "Enter") toggleMenu();
        }}
        aria-label="Menu burger"
        aria-expanded={isMenuOpen ? "true" : "false"} // Ajout de cette ligne
      >
        <span className="burger-icon" />
        <span className="burger-icon" />
        <span className="burger-icon" />
      </button>
    </div>
  );
}

export default Header;
