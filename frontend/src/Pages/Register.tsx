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
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès

  const navigate = useNavigate(); // Initialiser useNavigate

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // vérification des champs
    if (!username || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    // verification du champ username
    if (username.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }
    // Vérification du champ email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("L'email n'est pas valide");
      return;
    }
    // Vérification des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    // Vérification de la longueur du mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    // Vérification de la présence d'une majuscule dans le mot de passe
    const upperCasePattern = /[A-Z]/;
    if (!upperCasePattern.test(password)) {
      setError("Le mot de passe doit contenir au moins une majuscule");
      return;
    }
    // Vérification de la présence d'une minuscule dans le mot de passe
    const lowerCasePattern = /[a-z]/;
    if (!lowerCasePattern.test(password)) {
      setError("Le mot de passe doit contenir au moins une minuscule");
      return;
    }
    // Vérification de la présence d'un chiffre dans le mot de passe
    const digitPattern = /\d/;
    if (!digitPattern.test(password)) {
      setError("Le mot de passe doit contenir au moins un chiffre");
      return;
    }
    // Vérification de la présence d'un caractère spécial dans le mot de passe
    const specialCharPattern = /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/;
    if (!specialCharPattern.test(password)) {
      setError("Le mot de passe doit contenir au moins un caractère spécial");
      return;
    }

    setLoading(true);

    try {
      // Appel à l'API pour inscrire l'utilisateur, avec le rôle "user" par défaut
      const response = await myAxiosInstance.post("/api/auth/register", {
        username,
        email,
        password,
        confirmPassword,
        role: "user", // On assigne directement le rôle "user" ici
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
      setSuccessMessage(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );

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
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
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
