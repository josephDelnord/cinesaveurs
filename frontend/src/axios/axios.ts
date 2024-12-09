// axiosInstance.js
import axios from 'axios';
import { getTokenAndPseudoFromLocalStorage } from '../localstorage/localstorage';

// Création de l'instance Axios avec une base URL
const myAxiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
});

// Intercepteur pour ajouter automatiquement le token dans les en-têtes de chaque requête
myAxiosInstance.interceptors.request.use(
    (config) => {
        // Récupérer le token du localStorage
        const { token } = getTokenAndPseudoFromLocalStorage();
        if (token) {
            // Ajouter le token dans l'en-tête Authorization
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default myAxiosInstance;
