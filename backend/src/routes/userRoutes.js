// routes/userRoutes.js
import express from 'express';
import { getUserInfo, updateUserInfo, deleteUser } from '../controllers/userController.js';
import authRoute from '../middlewares/authRoute.js'; // Middleware d'authentification

const router = express.Router();

// Route pour récupérer les informations de l'utilisateur connecté
// La route utilise le middleware d'authentification pour vérifier le token JWT
router.get('/me', authRoute, getUserInfo);

// Route pour mettre à jour les informations de l'utilisateur connecté
// Elle utilise également le middleware d'authentification pour vérifier l'identité de l'utilisateur
router.put('/me', authRoute, updateUserInfo);

// Route pour supprimer l'utilisateur connecté
// La route est protégée par le middleware d'authentification
router.delete('/me', authRoute, deleteUser);

export default router;
