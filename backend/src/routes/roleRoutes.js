import express from 'express';
import { getAllRoles, createRole, deleteRole, getRolesEnum } from '../controllers/roleController.js';

const router = express.Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Récupérer tous les rôles
 *     tags:
 *       - Rôles
 *     responses:
 *       200:
 *         description: Liste des rôles récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllRoles);

/**
 * @swagger
 * /roles/addRole:
 *   post:
 *     summary: Créer un nouveau rôle
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
router.post('/addRole', createRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Supprimer un rôle par ID
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
router.delete('/:id', deleteRole);

/**
 * @swagger
 * /roles/enum:
 *   get:
 *     summary: Récupérer les rôles possibles (enum)
 *     tags:
 *       - Rôles
 *     responses:
 *       200:
 *         description: Liste des rôles possibles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: ["admin", "user", "guest"]
 *       500:
 *         description: Erreur serveur
 */
router.get('/enum', getRolesEnum);

export default router;
