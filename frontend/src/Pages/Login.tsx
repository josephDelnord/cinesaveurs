import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import myAxiosInstance from "../axios/axios";
import {
  saveTokenAndPseudoInLocalStorage,
  getTokenAndPseudoFromLocalStorage,
} from "../localstorage/localstorage";
import Loading from "../components/Loading";

// Fonction pour gérer la connexion
const authenticateUser = async (
  email: string,
  password: string,
  setToken: React.Dispatch<React.SetStateAction<string>>,
  setUsername: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: ReturnType<typeof useNavigate>
) => {
  if (!email || !password) {
    setError("Veuillez remplir tous les champs");
    return;
  }
  // Vérification du champ email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    setError("L'email n'est pas valide");
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
    setError("Le mot de passe doit contenir au moins un caractère*spécial");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await myAxiosInstance.post("/api/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;
    const { username, id: userId, role } = user;

    if (!token || !username) {
      throw new Error("Token ou pseudo manquant dans la réponse");
    }

    // Sauvegarder les informations dans le localStorage
    saveTokenAndPseudoInLocalStorage(username, token, role, userId);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("authToken", token); // Sauvegarde du token dans localStorage

    setToken(token);
    setUsername(username);

    // Redirection après une seconde
    setTimeout(() => {
      navigate("/profile"); // Redirection après connexion
      window.location.reload();
    }, 1000);
  } catch (err) {
    setLoading(false);

    // Gestion des erreurs
    if (axios.isAxiosError(err)) {
      if (err.response) {
        console.error("Erreur de connexion:", err.response);
        setError(
          err.response?.data?.message ||
            "Une erreur s'est produite lors de la connexion."
        );
      } else {
        console.error("Erreur réseau:", err);
        setError("Erreur réseau, veuillez vérifier votre connexion.");
      }
    } else {
      console.error("Erreur inconnue:", err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    }
  } finally {
    setLoading(false);
  }
};

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Chargement des données depuis le localStorage lors du premier rendu
  useEffect(() => {
    const result = getTokenAndPseudoFromLocalStorage();
    if (result) {
      const { token, username } = result;
      if (token && username) {
        setToken(token);
        setUsername(username);
      }
    }
  }, []);

  // Gestion de la soumission du formulaire
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateUser(
      email,
      password,
      setToken,
      setUsername,
      setError,
      setLoading,
      navigate
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="login-page">
      {token ? (
        <div className="logged-in">
          <h1>Bienvenue, {username || "Utilisateur"}!</h1>
          <button
            type="button"
            onClick={() => {
              localStorage.clear(); // Efface toutes les informations stockées
              setToken("");
              setUsername("");
              navigate("/login"); // Redirection vers la page de connexion
            }}
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <>
          <h1>Connexion</h1> {/* Déplacé ici */}
          <div className="login-form">
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? <Loading /> : "Se connecter"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
