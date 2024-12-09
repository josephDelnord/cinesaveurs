import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrSelf } from '../middlewares/roleMiddleware.js'; 
import { getUserInfo, updateUser, deleteUser, getAllUsers, checkUserStatus, suspendUser, activateUser, banUser } from '../controllers/userController.js';  

const router = express.Router();

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: "Récupérer les informations d'un utilisateur"
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à récupérer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 status:
 *                   type: string
 *                 role:
 *                   type: string
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
 *     summary: "Mettre à jour les informations d'un utilisateur"
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à mettre à jour
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: body
 *         description: Nouveau nom de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: Nouvel email de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         description: Mot de passe actuel de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *       - name: newPassword
 *         in: body
 *         description: Nouveau mot de passe de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *       - name: confirmPassword
 *         in: body
 *         description: Confirmation du nouveau mot de passe
 *         required: true
 *         schema:
 *           type: string
 *       - name: status
 *         in: body
 *         description: ID du nouveau statut de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *       - name: role
 *         in: body
 *         description: ID du nouveau rôle de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 status:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Données invalides (par exemple, mauvais mot de passe, statut ou rôle non valide)
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
 *     summary: "Supprimer un utilisateur (accessible uniquement par un administrateur)"
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
 *     summary: "Récupérer tous les utilisateurs (accessible uniquement par un administrateur)"
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

/**
 * @swagger
 * /users/{userId}/status:
 *   get:
 *     summary: "Vérifier le statut de l'utilisateur"
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur dont on veut vérifier le statut
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de l'utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Le statut actuel de l'utilisateur
 *       403:
 *         description: Accès interdit. Vous ne pouvez accéder qu'à vos propres informations
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 *       401:
 *         description: Non autorisé à accéder à ces informations
 *       400:
 *         description: Données invalides
 */
router.get('/:userId/status', authMiddleware, isAdminOrSelf, checkUserStatus);

/**
 * @swagger
 * /users/{userId}/status:
 *   put:
 *     summary: "Suspender un utilisateur"
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à suspendre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur suspendu avec succès
 *       403:
 *         description: Accès interdit. Vous devez être administrateur pour suspendre un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:userId/status', authMiddleware, isAdmin, suspendUser);

/**
 * @swagger
 * /users/{userId}/status:
 *   put:
 *     summary: "Activer un utilisateur"
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à suspendre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur suspendu avec succès
 *       403:
 *         description: Accès interdit. Vous devez être administrateur pour suspendre un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:userId/status', authMiddleware, isAdmin, activateUser);

/**
 * @swagger
 * /users/{userId}/status:
 *   put:
 *     summary: "Bannir un utilisateur"
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID de l'utilisateur à bannir
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur banni avec succès
 *       403:
 *         description: Accès interdit. Vous devez être administrateur pour bannir un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:userId/status', authMiddleware, isAdmin, banUser);

export default router;
