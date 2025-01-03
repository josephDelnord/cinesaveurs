import Score from "../models/Score.js";
import { memcached } from "../cache/memcached.js"; // Importer les fonctions de cache
import { cacheMiddleware, cacheResponse } from "../cache/memcached.js"; // Importer les middlewares pour le cache

// Récupérer les scores de toutes les recettes avec cache
export const getAllScores = (req, res) => {
  const cacheKey = "GET:/api/scores"; // Clé de cache pour récupérer tous les scores

  // Vérification du cache
  cacheMiddleware(req, res, () => {
    // Si les données sont dans le cache, elles ont été déjà envoyées par le middleware cacheMiddleware
    // Sinon, on continue ici pour récupérer depuis la base de données
    Score.find()
      .populate("user", "username") // Peupler uniquement le nom d'utilisateur
      .populate("recipe", "title") // Peupler uniquement le titre de la recette
      .then((scores) => {
        if (!scores.length) {
          return res.status(200).json([]); // Si aucune note n'est trouvée, renvoyer une liste vide
        }

        // Si des scores sont récupérés, les mettre en cache
        memcached.set(cacheKey, JSON.stringify(scores), 3600, (err) => {
          if (err) {
            console.error("Erreur lors de la mise en cache des scores:", err);
            return res
              .status(500)
              .json({ message: "Erreur lors de la mise en cache des scores" });
          }
          console.log("Scores mis en cache pour GET:/api/scores");
        });

        // Mise en cache des scores
        cacheResponse(req, res, () => {
          // Renvoie les scores depuis la base de données
          res.status(200).json(scores);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des scores depuis la base de données:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des scores",
        });
      });
  });
};
