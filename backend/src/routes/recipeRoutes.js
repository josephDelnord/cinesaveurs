import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrSelf } from '../middlewares/roleMiddleware.js';

import { 
  getRecipes, 
  getRecipeById, 
  getRecipesByCategory, 
  addRecipe, 
  updateRecipe, 
  deleteRecipe, 
  searchRecipes,
  addComment,
  addOrUpdateScore
} from '../controllers/recipeController.js';

const router = express.Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: "Obtenir toutes les recettes (tout le monde)"
 *     description: "Retourne une liste de toutes les recettes."
 *     tags: [Recettes]
 *     responses:
 *       200:
 *         description: "Liste des recettes"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: "Le titre de la recette"
 *                     example: "Recette 1"
 *                   description:
 *                     type: string
 *                     description: "La description de la recette"
 *                     example: "Une recette délicieuse inspirée d'un film."
 */
router.get('/', getRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: "Obtenir une recette par ID (admin ou utilisateur lui-même)"
 *     description: "Retourne les détails d'une recette en fonction de son ID."
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "L'ID de la recette"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Détails de la recette"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "Recette 1"
 *                 description:
 *                   type: string
 *                   example: "Recette inspirée d'un film."
 *       404:
 *         description: "Recette non trouvée"
 */
router.get('/:id', getRecipeById);

/**
 * @swagger
 * /recipes/category/{categoryId}:
 *   get:
 *     summary: "Obtenir les recettes d'une catégorie (admin ou utilisateur lui-même)"
 *     description: "Retourne une liste de recettes d'une catégorie spécifique."
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: "ID de la catégorie"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Recettes de la catégorie"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Recette de la catégorie 1"
 *       404:
 *         description: "Aucune recette trouvée pour cette catégorie"
 */
router.get('/:categoryId', authMiddleware, isAdminOrSelf, getRecipesByCategory);

/**
 * @swagger
 * /recipes/addRecipe:
 *   post:
 *     summary: "Ajouter une nouvelle recette (admin ou utilisateur lui-même)"
 *     description: "Permet d'ajouter une nouvelle recette à la base de données."
 *     tags: [Recettes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Le titre de la recette"
 *                 example: "Recette de gâteau au chocolat"
 *               description:
 *                 type: string
 *                 description: "La description de la recette"
 *                 example: "Une recette délicieuse pour un gâteau au chocolat."
 *               categoryId:
 *                 type: string
 *                 description: "L'ID de la catégorie de la recette"
 *                 example: "605c72ef153207001f6470a"
 *     responses:
 *       201:
 *         description: "Recette ajoutée avec succès"
 *       400:
 *         description: "Données invalides"
 */
router.post('/addRecipe', authMiddleware, isAdminOrSelf, addRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: "Mettre à jour une recette (admin seulement)"
 *     description: "Met à jour les détails d'une recette existante."
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "L'ID de la recette à mettre à jour"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Le titre de la recette"
 *                 example: "Recette de gâteau au chocolat"
 *               description:
 *                 type: string
 *                 description: "La description de la recette"
 *                 example: "Une nouvelle version de la recette."
 *               categoryId:
 *                 type: string
 *                 description: "L'ID de la catégorie"
 *     responses:
 *       200:
 *         description: "Recette mise à jour avec succès"
 *       404:
 *         description: "Recette non trouvée"
 */
router.put('/:id', authMiddleware, isAdmin, updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: "Supprimer une recette (admin seulement)"
 *     description: "Permet de supprimer une recette à partir de son ID."
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "L'ID de la recette à supprimer"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Recette supprimée avec succès"
 *       404:
 *         description: "Recette non trouvée"
 */
router.delete('/:id', authMiddleware, isAdmin, deleteRecipe);

/**
 * @swagger
 * /recipes/research:
 *   post:
 *     summary: "Rechercher des recettes (tout le monde)"
 *     description: "Permet de rechercher des recettes par titre, catégorie ou source."
 *     tags: [Recettes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: "Le terme de recherche"
 *                 example: "gâteau au chocolat"
 *               categoryId:
 *                 type: string
 *                 description: "L'ID de la catégorie (facultatif)"
 *                 example: "605c72ef153207001f6470a"
 *     responses:
 *       200:
 *         description: "Résultats de la recherche"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Gâteau au chocolat"
 *                   description:
 *                     type: string
 *                     example: "Une recette facile pour un gâteau au chocolat."
 *       400:
 *         description: "Requête invalide"
 */
router.post('/research', searchRecipes);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: "Ajouter un commentaire (admin ou utilisateur lui-même)"
 *     description: "Permet à un utilisateur d'ajouter un commentaire sur une recette."
 *     tags: [Commentaires]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       description: "Commentaire à ajouter"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Commentaire ajouté avec succès"
 *       400:
 *         description: "Données invalides"
 *       401:
 *         description: "Non autorisé"
 *       500:
 *       description: "Erreur serveur"
 */
router.post('/:id/comments', authMiddleware, isAdminOrSelf, addComment); 

/**
 * @swagger
 * /scores:
 *   post:
 *     summary: "Ajouter ou mettre à jour un score pour une recette (admin ou utilisateur lui-même)"
 *     tags:
 *       - Scores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - recipeId
 *               - userId
 *             properties:
 *               score:
 *                 type: number
 *                 example: 4
 *               recipeId:
 *                 type: string
 *                 example: "60b5f9072f8fb814f470603b"
 *               userId:
 *                 type: string
 *                 example: "60b5f9072f8fb814f470603a"
 *     responses:
 *       200:
 *         description: Le score a été mis à jour ou ajouté avec succès.
 *       400:
 *         description: Données invalides ou manquantes.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/id/scores', authMiddleware, isAdminOrSelf, addOrUpdateScore);

export default router;
