import express from "express";
import { connectDB } from "../data/db.js";

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    // Appelle la fonction de connexion à la base de données
    await connectDB();
    res.status(200).send("Connexion à la base de données réussie !");
  } catch (error) {
    res
      .status(500)
      .send(`Erreur de connexion à la base de données : ${error.message}`);
  }
});

export default router;
