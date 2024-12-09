// fonctions pour interagir avec le localstorage

interface DecodedToken {
  [key: string]: string | number | boolean | null;
  pseudo: string;
  userId: string;
  role: string;
  token: string;

}

// sauvegarde le username et le token dans le localstorage

export const saveTokenAndPseudoInLocalStorage = (username: string, token: string, role: string, userId: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('pseudo', username);
  localStorage.setItem('role', role);
  localStorage.setItem('userId', userId); // Stocker l'userId
};

// Fonction pour récupérer les informations stockées
export const getTokenAndPseudoFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('pseudo');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  return { token, username, role, userId };
};
// supprime le username et le token du localstorage
export const removePseudoAndTokenFromLocalStorage = () => {
    localStorage.removeItem("pseudo");  // Utilisation de 'username' au lieu de 'pseudo'
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
}

 // Fonction pour décoder le JWT et extraire les informations
export const decodeToken = (token: string): DecodedToken | null => {
  if (!token) return null;

  // Décoder le token (le payload est la deuxième partie du JWT, après le point)
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};
