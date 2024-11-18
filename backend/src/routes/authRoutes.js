import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Cette route permet à un utilisateur de s'inscrire en fournissant son nom, son email et son mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       description: Informations nécessaires à l'inscription
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom de l'utilisateur
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur existant
 *     description: Cette route permet à un utilisateur de se connecter en fournissant son email et son mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       description: Informations nécessaires à la connexion
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie, un token d'accès est retourné
 *       400:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', login);

export default router;
