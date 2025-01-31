import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedDatabase from './seed.mjs';

dotenv.config();

// Fonction pour se connecter à MongoDB
export const connectDB = async () => {
    try {
        // Récupération de l'URI de connexion à MongoDB à partir des variables d'environnement
        const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_FOR_PROD;

        if (!mongoURI) {
            throw new Error('Variable d\'environnement MONGODB_URI non définie');
        }

        // Connexion à MongoDB avec les options recommandées
        await mongoose.connect(mongoURI);

        console.log('Connecté à MongoDB');

        // Log pour déboguer la valeur de SEED_DB
        console.log('Valeur de SEED_DB:', process.env.SEED_DB);

        // Vérification de la variable d'environnement SEED_DB et lancement du seeding si nécessaire
        if (process.env.SEED_DB === 'true') {
            console.log('Démarrage du seeding...');
            await seedDatabase();
        } else {
            console.log('Seeding désactivé');
        }
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        console.error('URI de connexion utilisé:', process.env.MONGODB_URI || process.env.MONGODB_URI_FOR_PROD);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        } else {
            console.error('Erreur de connexion à MongoDB, tests échoués.');
            // Ne pas arrêter le processus pendant les tests
        }

    }
};

// Fonction pour déconnecter proprement MongoDB
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB');
    } catch (error) {
        console.error('Erreur de déconnexion de MongoDB:', error);
    }
};

export default connectDB;