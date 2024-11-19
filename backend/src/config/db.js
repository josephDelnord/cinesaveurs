import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedDatabase from '../data/seed.js';

dotenv.config();

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinedelices';

        // Connexion à MongoDB sans les options dépréciées
        await mongoose.connect(mongoURI);
        console.log('Connecté à MongoDB');

        // Log pour déboguer la valeur de SEED_DB
        console.log('Valeur de SEED_DB:', process.env.SEED_DB);

        // Conditionner l'exécution du seeding en fonction de SEED_DB
        if (process.env.SEED_DB === 'true') {
            console.log('Démarrage du seeding...');
            await seedDatabase();  // Lancer le seeding si SEED_DB est à 'true'
        } else {
            console.log('Seeding désactivé');
        }
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);  // Arrêter l'application si la connexion échoue
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
