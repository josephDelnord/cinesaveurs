import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./src/routes/recipeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import scoreRoutes from "./src/routes/scoreRoutes.js";
import statusRoutes from "./src/routes/statusRoutes.js";
import setupSwagger from "./swagger.js";
import { connectDB } from "./src/config/db.js";
import {
  cacheMiddleware,
  cacheResponse,
  invalidateCache,
} from "./src/cache/memcached.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Configurer Swagger
setupSwagger(app);

// Middleware CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true, // Autoriser les credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
  })
);

// Middleware pour parser les données JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware global pour vérifier le cache
app.use(cacheMiddleware); // Vérifie si les données sont dans le cache avant d'aller à la route

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/users/:id/status", statusRoutes);

// Route de test
app.get("/api", (req, res) => {
  res.send("Hello, you are in the world of recipes!");
});

// Middleware pour mettre en cache la réponse (après que la route a traité la requête)
app.use(cacheResponse);

// Exemple de suppression de recette qui invalide le cache
app.delete("/api/recipes/:id", (req, res) => {
  const recipeId = req.params.id;
  console.log(`Suppression de la recette avec ID: ${recipeId}`);

  invalidateCache(req); // Invalider le cache de cette recette

  res.json({ message: "Recette supprimée avec succès!" });
});

// Démarrage du serveur
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app; // Exporter l'application pour les tests
