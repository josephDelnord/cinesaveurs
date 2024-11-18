import express from 'express';
import { getScoresByRecipe, getScoreByUserAndRecipe, addOrUpdateScore, deleteScore } from '../controllers/scoreController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /scores:
 *   post:
 *     summary: Ajouter ou mettre à jour un score pour une recette
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
router.post('/', authMiddleware, addOrUpdateScore);

/**
 * @swagger
 * /scores/{recipeId}:
 *   get:
 *     summary: Récupérer les scores d'une recette
 *     tags:
 *       - Scores
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         description: L'ID de la recette pour laquelle récupérer les scores
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des scores pour la recette avec la note moyenne.
 *       404:
 *         description: Aucune note trouvée pour cette recette.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:recipeId', getScoresByRecipe);

/**
 * @swagger
 * /score/{recipeId}:
 *   get:
 *     summary: Récupérer le score d'un utilisateur pour une recette spécifique
 *     tags:
 *       - Scores
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         description: L'ID de la recette pour laquelle récupérer le score de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Score de l'utilisateur pour la recette.
 *       404:
 *         description: Aucun score trouvé pour l'utilisateur et la recette.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/score/:recipeId', authMiddleware, getScoreByUserAndRecipe);

/**
 * @swagger
 * /scores/{scoreId}:
 *   delete:
 *     summary: Supprimer un score
 *     tags:
 *       - Scores
 *     parameters:
 *       - name: scoreId
 *         in: path
 *         description: L'ID du score à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Score supprimé avec succès.
 *       404:
 *         description: Score non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/:scoreId', authMiddleware, deleteScore);

export default router;
