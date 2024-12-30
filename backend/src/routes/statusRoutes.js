import express from "express";
import {
  getStatus,
  getStatusById,
  createStatus,
} from "../controllers/statusController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /users/:id/status:
 *   get:
 *     summary: "Récupérer tous les statuts (admin seulement)"
 *     tags:
 *       - Statuts
 *     responses:
 *       200:
 *         description: Liste des statuts
 *       500:
 *         description: Erreur serveur.
 */
router.get("/", authMiddleware, isAdmin, getStatus);

/**
 * @swagger
 * /users/:id/status/{id}:
 *   get:
 *     summary: "Récupérer un statut par ID (admin seulement)"
 *     tags:
 *       - Statuts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID unique du statut à récupérer
 *     responses:
 *       200:
 *         description: Statut trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "607c1f77bcf86cd799439011"
 *                 status_name:
 *                   type: string
 *                   example: "En cours"
 *       404:
 *         description: Statut non trouvé pour l'ID donné
 *       500:
 *         description: Erreur serveur interne
 */
router.get("/:id/status/:id", authMiddleware, isAdmin, getStatusById);

/**
 * @swagger
 * /users/:id/status:
 *   post:
 *     summary: "Créer un statut (admin seulement)"
 *     tags:
 *       - Statuts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *         schema:
 *           type: object
 *           properties:
 *             status_name:
 *               type: string
 *               example: "En cours"
 *             description:
 *               type: string
 *               example: "Le statut est en cours de traitement"
 *     responses:
 *       201:
 *         description: Statut créé avec succès
 *       400:
 *         description: Données invalides ou manquantes.
 *       500:
 *         description: Erreur serveur.
 */
router.post("/", authMiddleware, isAdmin, createStatus);

export default router;
