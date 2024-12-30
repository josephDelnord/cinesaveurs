import express from "express";
import { getAllScores } from "../controllers/scoreController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: "Récupérer les notes de toutes les recettes (admin seulement)"
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
router.get("/", authMiddleware, getAllScores);

export default router;
