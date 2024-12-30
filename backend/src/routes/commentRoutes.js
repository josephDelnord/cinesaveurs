// src/routes/commentRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getComments } from "../controllers/commentController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: "Récupérer les commentaires de toutes les recettes (admin seulement)"
 *     description: "Permet de récupérer tous les commentaires de toutes les recettes. Seuls les administrateurs peuvent accéder à cette route."
 *     tags: [Commentaires]
 *     responses:
 *       200:
 *         description: "Liste des commentaires"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   content:
 *                     type: string
 *       404:
 *         description: "Recette non trouvée"
 *       500:
 *         description: "Erreur serveur"
 */
router.get("/", authMiddleware, isAdmin, getComments);

export default router;
