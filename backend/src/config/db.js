import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedDatabase from '../data/seed.js';

dotenv.config();

// Fonction pour se connecter à MongoDB
export const connectDB = async () => {
    try {
        // Récupération de l'URI de connexion à MongoDB à partir des variables d'environnement
        const mongoURI = process.env.MONGO_URI;

        // Connexion à MongoDB avec les options recommandées pour éviter les avertissements
        await mongoose.connect(mongoURI, {});
        console.log('Connecté à MongoDB');

        // Log pour déboguer la valeur de SEED_DB
        console.log('Valeur de SEED_DB:', process.env.SEED_DB);

        // Vérification de la variable d'environnement SEED_DB et lancement du seeding si nécessaire
        if (process.env.SEED_DB === 'true') {
            console.log('Démarrage du seeding...');
            await seedDatabase();  // Lancer le seeding si SEED_DB est à 'true'
        } else {
            console.log('Seeding désactivé');
        }
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);  // Arrêter l'application si la connexion échoue pour éviter les erreurs, sauf en cas de test
    }
};

// Optionnel : une fonction pour déconnecter proprement MongoDB si nécessaire
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB');
    } catch (error) {
        console.error('Erreur de déconnexion de MongoDB:', error);
    }
};
