import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';   
import { isAdmin, isAdminOrSelf } from '../middlewares/roleMiddleware.js';  
import { getUserInfo, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';  

const router = express.Router();

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Récupérer les informations d'un utilisateur (admin ou utilisateur lui-même)
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à récupérer
 *         required: true
 *         schema:
 *           type: string
 *           example: "60b5f9072f8fb814f470603b"
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *       403:
 *         description: Non autorisé à accéder à ces informations (l'utilisateur ne correspond pas)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:userId', authMiddleware, isAdminOrSelf, getUserInfo);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Mettre à jour les informations d'un utilisateur (admin ou utilisateur lui-même)
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à mettre à jour
 *         required: true
 *         schema:
 *           type: string
 *           example: "60b5f9072f8fb814f470603b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "newusername"
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur mises à jour avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Non autorisé à mettre à jour ces informations
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:userId', authMiddleware, isAdminOrSelf, updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur (accessible uniquement par un administrateur)
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à supprimer
 *         required: true
 *         schema:
 *           type: string
 *           example: "60b5f9072f8fb814f470603b"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       403:
 *         description: Non autorisé à supprimer cet utilisateur (nécessite un rôle admin)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:userId', authMiddleware, isAdmin, deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (accessible uniquement par un administrateur)
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *       403:
 *         description: Non autorisé à accéder à cette liste (nécessite un rôle admin)
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authMiddleware, isAdmin, getAllUsers);

export default router;
