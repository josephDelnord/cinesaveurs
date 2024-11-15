
// src/routes/recipeRoutes.js
import express from 'express';
import authRoute from '../middlewares/authRoute.js';
import { getRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';

const router = express.Router();

// Route pour obtenir toutes les recettes - accessible sans authentification
router.get('/', getRecipes);  // Note : pas besoin de '/api/recipes' ici, car j'ai déjà défini le préfixe dans index.js

// Route pour obtenir une recette par ID - nécessite une authentification
router.get('/:id', authRoute, getRecipeById);

// Route pour ajouter une nouvelle recette - nécessite une authentification
router.post('/', authRoute, addRecipe);

// Route pour mettre à jour une recette - nécessite une authentification
router.put('/:id', authRoute, updateRecipe);

// Route pour supprimer une recette - nécessite une authentification
router.delete('/:id', authRoute, deleteRecipe);

export default router;
