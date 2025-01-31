import type React from "react";
import { useState } from "react";
import myAxiosInstance from "../axios/axios";
import {
  saveTokenAndPseudoInLocalStorage,
  decodeToken,
} from "../localstorage/localstorage";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès

  const navigate = useNavigate(); // Initialiser useNavigate

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Validation de l'email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("L'email n'est pas valide");
      return;
    }

    setLoading(true);

    try {
      // Appel à l'API pour inscrire l'utilisateur
      const response = await myAxiosInstance.post("/api/auth/register", {
        username,
        email,
        password,
        confirmPassword,
        role,
      });

      // Sauvegarder le token et le pseudo dans le localStorage
      const { token } = response.data;
      const decodedToken = decodeToken(token);

      if (!decodedToken || !decodedToken.userId || !decodedToken.role) {
        throw new Error("Le token ne contient pas un userId ou un role valide");
      }

      // Sauvegarde des données dans le localStorage
      saveTokenAndPseudoInLocalStorage(
        username,
        token,
        decodedToken.role,
        decodedToken.userId
      );

      // Afficher un message de succès à l'utilisateur
      setError(""); // On réinitialise l'éventuel message d'erreur
      setSuccessMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");

      // Attendre un court instant avant de déconnecter l'utilisateur et de le rediriger
      setTimeout(() => {
        // Déconnexion de l'utilisateur (en supprimant le token et les informations de l'utilisateur du localStorage)
        localStorage.removeItem("token");
        localStorage.removeItem("pseudo");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        // Rediriger l'utilisateur vers la page de connexion
        navigate("/login");

        // Recharger la page pour mettre à jour le header
        window.location.reload();
      }, 3000); // Le message restera affiché pendant 3 secondes

    } catch (err) {
      setLoading(false);

      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response?.data?.message ||
            "Une erreur s'est produite lors de l'inscription."
        );
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    } finally {
      setLoading(false); // Réinitialiser l'état de chargement après la requête
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="register-page">
      <h2>Inscription</h2>

      {/* Affichage du message de succès */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleRegister}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Nom"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {/* Dropdown pour choisir le rôle */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Sélectionner un rôle</option>
          <option value="admin">Admin</option>
          <option value="user">Utilisateur</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "S'inscrire"}
        </button>
        <div className="login-link">
          <p>
            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
