// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setAuthenticated } from "../slices/authSlice";
import type { RootState } from "../store"; // Assure-toi d'importer le bon type RootState

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Utilisation du store Redux pour récupérer l'état d'authentification
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const userPseudo = localStorage.getItem("pseudo");
  const userRole = localStorage.getItem("role");

  // Ouvre/ferme le menu burger
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Action de déconnexion
  const handleLogout = () => {
    dispatch(logout()); // Déconnexion via Redux
    localStorage.removeItem("pseudo");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/"); // Redirection vers la page d'accueil
  };

  const profileLink = userRole === "admin" ? "/admin/profile" : "/profile";

  // Vérifier si l'utilisateur est authentifié au chargement
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setAuthenticated(true)); // Si le token est présent, l'utilisateur est authentifié
    } else {
      dispatch(setAuthenticated(false)); // Si le token est absent, l'utilisateur n'est pas authentifié
    }
  }, [dispatch]);

  return (
    <div id="header">
      <Link to="/">
        <img id="logo-header" src="/img/logo.webp" alt="logo" />
      </Link>

      <nav id="nav" className={isMenuOpen ? "open" : ""}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>
              Accueil
            </Link>
          </li>

          {!isAuthenticated ? (
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
          ) : (
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
          )}

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
      >
        <span className="burger-icon" />
        <span className="burger-icon" />
        <span className="burger-icon" />
      </button>
    </div>
  );
}
export default Header;
