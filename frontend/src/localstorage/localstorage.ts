interface DecodedToken {
  [key: string]: string | number | boolean | null;
  pseudo: string;
  userId: string;
  role: string;
  token: string;
}

// Sauvegarde le username et le token dans le localstorage
export const saveTokenAndPseudoInLocalStorage = (username: string, token: string, role: string, userId: string) => {
  // Vérification que toutes les données nécessaires sont disponibles avant de les enregistrer
  if (!token || !username || !role || !userId) {
    console.error('Toutes les informations nécessaires ne sont pas fournies pour enregistrer le token.');
    return;
  }

  localStorage.setItem('token', token);
  localStorage.setItem('pseudo', username);
  localStorage.setItem('role', role);
  localStorage.setItem('userId', userId); // Stocker l'userId
};

// Fonction pour récupérer les informations stockées depuis le localStorage
export const getTokenAndPseudoFromLocalStorage = () => {
  // Récupération des valeurs depuis localStorage
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('pseudo');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  // Vérification de la présence des données
  if (!token || !username || !role || !userId) {
    console.warn('Certaines informations sont manquantes dans le localStorage.');
    return null;
  }

  // Retour des données sous forme d'objet
  return { token, username, role, userId };
};

// Supprimer les données du localStorage
export const removePseudoAndTokenFromLocalStorage = () => {
  localStorage.removeItem('pseudo');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
};

// Fonction pour décoder le JWT et extraire les informations
export const decodeToken = (token: string): DecodedToken | null => {
  if (!token) {
    console.error('Aucun token fourni pour le décodage.');
    return null;
  }

  try {
    // Décoder le token (le payload est la deuxième partie du JWT, après le point)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
      `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
    ).join(''));

    // Retourner les données décodées
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erreur lors du décodage du token:', e);
    return null;
  }
};

// Fonction pour vérifier si le token est valide (ex: vérification de l'expiration)
export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;

  const exp = decoded.exp ? new Date(Number(decoded.exp) * 1000) : null; // Assumer que 'exp' est un timestamp
  if (exp && exp < new Date()) {
    console.warn('Le token a expiré.');
    return false;
  }

  return true;
};
