import express from 'express';
import { isAdmin, isAdminOrSelf } from '../middlewares/roleMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllCategories, createCategory, deleteCategory, getCategoryById, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: "Récupérer toutes les catégories (admin ou utilisateur lui-même)"
 *     description: "Cette route permet de récupérer la liste de toutes les catégories disponibles."
 *     tags:
 *       - Catégories
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authMiddleware, isAdminOrSelf, getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: "Récupérer une catégorie par ID (admin ou utilisateur lui-même)"
 *     description: "Cette route permet de récupérer une catégorie spécifique par son ID."
 *     tags:
 *       - Catégories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la catégorie à récupérer
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f2b8bb"
 *     responses:
 *       200:
 *         description: Catégorie récupérée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authMiddleware, isAdminOrSelf, getCategoryById);

/**
 * @swagger
 * /api/categories/addCategory:
 *   post:
 *     summary: "Ajouter une nouvelle catégorie (admin seulement)"
 *     description: "Cette route permet d'ajouter une nouvelle catégorie à la liste."
 *     tags:
 *       - Catégories
 *     requestBody:
 *       description: Données nécessaires pour créer une catégorie
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la catégorie
 *                 example: "Cuisine asiatique"
 *     responses:
 *       201:
 *         description: Catégorie ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/addCategory', authMiddleware, isAdmin, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: "Mettre à jour une catégorie par ID (admin seulement)"
 *     description: "Cette route permet de mettre à jour une catégorie existante par son ID."
 *     tags:
 *       - Catégories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la catégorie à mettre à jour
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f2b8bb"
 *     requestBody:
 *       description: Données mises à jour de la catégorie
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nouveau nom de la catégorie
 *                 example: "Cuisine italienne"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', authMiddleware, isAdmin, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: "Supprimer une catégorie par ID (admin seulement)"
 *     description: "Cette route permet de supprimer une catégorie en utilisant son ID."
 *     tags:
 *       - Catégories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la catégorie à supprimer
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f2b8bb"
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

export default router;
