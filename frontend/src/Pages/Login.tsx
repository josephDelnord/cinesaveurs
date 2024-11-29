import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myAxiosInstance from '../axios/axios';
import { saveTokenAndPseudoInLocalStorage, getTokenAndPseudoFromLocalStorage } from '../localstorage/localstorage';

// Fonction pour gérer la connexion
const authenticateUser = async (email: string, password: string, setToken: React.Dispatch<React.SetStateAction<string>>, setUsername: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, navigate: ReturnType<typeof useNavigate>) => {
  if (!email || !password) {
    setError('Veuillez remplir tous les champs');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await myAxiosInstance.post('/api/auth/login', { email, password });

    const { token, user } = response.data;
    const { username, id: userId, role } = user;

    if (!token || !username) {
      throw new Error('Token ou pseudo manquant dans la réponse');
    }

    // Sauvegarder les informations dans le localStorage
    saveTokenAndPseudoInLocalStorage(username, token, role, userId);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);

    setToken(token);
    setUsername(username);

    // Redirection après une seconde
    setTimeout(() => {
      navigate('/'); // Redirection après connexion
    }, 1000);
  } catch (err) {
    setLoading(false);

    // Gestion des erreurs
    if (axios.isAxiosError(err)) {
      if (err.response) {
        console.error('Erreur de connexion:', err.response);
        setError(err.response?.data?.message || "Une erreur s'est produite lors de la connexion.");
      } else {
        console.error('Erreur réseau:', err);
        setError("Erreur réseau, veuillez vérifier votre connexion.");
      }
    } else {
      console.error('Erreur inconnue:', err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    }
  } finally {
    setLoading(false);
  }
};

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>(''); 
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Chargement des données depuis le localStorage lors du premier rendu
  useEffect(() => {
    const { token, username } = getTokenAndPseudoFromLocalStorage();
    if (token && username) {
      setToken(token);
      setUsername(username); 
    }
  }, []);

  // Gestion de la soumission du formulaire
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateUser(email, password, setToken, setUsername, setError, setLoading, navigate);
  };

  return (
    <div className="login-page">
      {token ? (
        <div className="logged-in">
          <h1>Bienvenue, {username || 'Utilisateur'}!</h1>
          <button onClick={() => {
            localStorage.clear(); // Efface toutes les informations stockées
            setToken('');
            setUsername('');
            navigate('/login'); // Redirection vers la page de connexion
          }}>
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="login-form">
          <h1>Connexion</h1>
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
              {loading ? 'Chargement...' : 'Se connecter'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
