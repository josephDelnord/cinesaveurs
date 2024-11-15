import mongoose from 'mongoose';
import seedDatabase from '../seeds/seed.js';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/cinedelices', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connecté à MongoDB');
        
        // Commenter cette ligne après le premier lancement
        await seedDatabase();
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
};