// axiosInstance.js
import axios from 'axios';
import { getTokenAndPseudoFromLocalStorage } from '../localstorage/localstorage';

const myAxiosInstance = axios.create({
    baseURL: 'https://localhost:5000',
});

// Intercepteur de requête
myAxiosInstance.interceptors.request.use(
    (config) => {

      const result = getTokenAndPseudoFromLocalStorage();
      if (result) {
        const { token } = result;
        console.log("Token extrait depuis localStorage :", token);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.error('Aucun token trouvé dans localStorage');
        }

        console.log("En-têtes avant envoi :", config.headers);
      } else {
        console.error('Aucun résultat retourné par getTokenAndPseudoFromLocalStorage');
      }

      return config;
    },
    (error) => {
      console.error("Erreur dans l'intercepteur Axios :", error);
      return Promise.reject(error);
    }
);

// Intercepteur de réponse
myAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Détails complets de l'erreur :", error);

        if (error.response) {
            // Le serveur a répondu avec un statut d'erreur
            console.error('Statut de l\'erreur :', error.response.status);
            console.error('Données de l\'erreur :', error.response.data);

            // Gestion des erreurs spécifiques
            switch (error.response.status) {
                case 401:
                    // Token expiré ou invalide
                    console.error('Token invalide ou expiré');
                    // Vous pouvez ajouter une logique de déconnexion ici
                    break;
                case 403:
                    console.error('Accès non autorisé');
                    break;
                case 404:
                    console.error('Ressource non trouvée');
                    break;
                case 500:
                    console.error('Erreur serveur interne');
                    break;
            }
        } else if (error.request) {
            // La requête a été faite mais pas de réponse
            console.error('Aucune réponse reçue du serveur');
        } else {
            // Erreur lors de la configuration de la requête
            console.error('Erreur de configuration de la requête', error.message);
        }

        return Promise.reject(error);
    }
);

export default myAxiosInstance;