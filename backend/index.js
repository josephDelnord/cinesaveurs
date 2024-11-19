import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipeRoutes from './src/routes/recipeRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import scoreRoutes from './src/routes/scoreRoutes.js';
import setupSwagger from './swagger.js';
import { connectDB } from './src/config/db.js'; // Connexion à MongoDB à partir de db.js

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB(); // Utilisation de la fonction de connexion définie dans config/db.js

// Configurer Swagger
setupSwagger(app);

// Middleware CORS - Corriger l'option "origin" (au lieu de "rigin")
app.use(cors({
    origin: 'http://localhost:3000',  // L'URL de votre frontend en production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'],  // En-têtes autorisés
}));

// Middleware pour parser les données JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation des routes avec le préfixe correspondant
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/scores', scoreRoutes);

// Route de test
app.get('/api', (req, res) => {
    res.send('Hello, you are in the world of recipes!');
});

// Ne pas démarrer le serveur ici (important pour les tests)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;  // Exporter l'application pour les tests
