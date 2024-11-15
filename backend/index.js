import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import seedDatabase from './src/data/seed.js';
import recipeRoutes from './src/routes/recipeRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();

// Connexion à MongoDB
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/backend';
mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

const app = express();
const PORT = process.env.PORT || 5000;

// Si tu veux peupler la base de données pendant le développement
if (process.env.SEED_DB) {
    seedDatabase();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation des routes définies dans recipeRoutes avec préfixe '/api/recipes'
app.use('/api/recipes', recipeRoutes);  // Le préfixe '/api/recipes' est ajouté ici
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/api', (req, res) => {
    res.send('Hello, you are in the world of recipes!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
