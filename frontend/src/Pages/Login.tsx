import { useState, useEffect } from 'react';
import myAxiosInstance from '../axios/axios';
import { saveTokenAndPseudoInLocalStorage, getTokenAndPseudoFromLocalStorage, removePseudoAndTokenFromLocalStorage } from '../localstorage/localstorage';

function Login() {
  // États pour gérer les champs du formulaire et les erreurs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');  // Nouveau état pour le pseudo
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Vérifier si l'utilisateur est déjà connecté au chargement de la page
  useEffect(() => {
    const { token, pseudo } = getTokenAndPseudoFromLocalStorage();
    if (token && pseudo) {
      setToken(token);
      setUsername(pseudo); // Stocker le pseudo dans l'état lors du chargement
    }
  }, []);

  // Fonction pour gérer la connexion
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Empêche l'envoi par défaut du formulaire

    // Vérifier que l'email et le mot de passe ne sont pas vides
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError(''); // Réinitialise les erreurs précédentes

    // Envoi des données au backend pour vérifier les identifiants
    myAxiosInstance.post('/api/auth/login', { email, password })
      .then(response => {
        const { token, pseudo } = response.data; // Supposons que la réponse contienne un token et un pseudo
        saveTokenAndPseudoInLocalStorage(pseudo, token); // Sauvegarder pseudo et token dans localStorage
        setToken(token);
        setUsername(pseudo);  // Mettre à jour l'état du pseudo
        setLoading(false);
      })
      .catch(err => {
        setError('Identifiants incorrects. Essayez à nouveau.');
        setLoading(false);
        console.error('Erreur de connexion:', err);
      });
  };

  const handleLogout = () => {
    // Supprimer le token d'Axios et réinitialiser l'état
    removePseudoAndTokenFromLocalStorage();
    setToken('');
    setUsername(''); // Réinitialiser le pseudo à la déconnexion
  };

  const fetchData = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    setLoading(true);
    setError('');

    myAxiosInstance.get('/api/protected/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Données protégées:', response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors de la récupération des données.');
        setLoading(false);
        console.error('Erreur de récupération des données:', err);
      });
  };

  return (
    <div className="login-page">
      {token ? (
        <div className="logged-in">
          <h1>Bienvenue, {username}!</h1> {/* Affichage du pseudo */}
          <button onClick={handleLogout}>Se déconnecter</button>
          <button onClick={fetchData}>Récupérer des données protégées</button>
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
