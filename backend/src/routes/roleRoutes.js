import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrSelf } from '../middlewares/roleMiddleware.js';
import { getAllRoles, getRoleById, createRole, deleteRole } from '../controllers/roleController.js';

const router = express.Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: "Récupérer tous les rôles (admin ou utilisateur lui-même)"
 *     tags:
 *       - Rôles
 *     responses:
 *       200:
 *         description: Liste des rôles récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authMiddleware, isAdminOrSelf, getAllRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: "Récupérer un rôle par ID (admin seulement)"
 *     tags:
 *       - Rôles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID du rôle à récupérer
 *     responses:
 *       200:
 *         description: Rôle récupéré avec succès
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get('/:id', authMiddleware, isAdmin, getRoleById);

/**
 * @swagger
 * /roles/addRole:
 *   post:
 *     summary: "Créer un nouveau rôle (admin seulement)"
 *     tags:
 *       - Rôles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du rôle
 *                 example: "admin"
 *               description:
 *                 type: string
 *                 description: Description du rôle
 *                 example: "Rôle ayant accès à toutes les fonctionnalités administratives"
 *     responses:
 *       201:
 *         description: Rôle créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authMiddleware, isAdmin, createRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: " Supprimer un rôle par ID (admin seulement)"
 *     tags:
 *       - Rôles
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du rôle à supprimer
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5c5e2f3d6f0bb55b71be8"
 *     responses:
 *       200:
 *         description: Rôle supprimé avec succès
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authMiddleware, isAdmin, deleteRole);

export default router;
