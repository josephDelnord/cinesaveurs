import Comment from "../models/Comment.js";
import { memcached } from "../cache/memcached.js"; // Importer les fonctions de cache
import { cacheMiddleware, cacheResponse } from "../cache/memcached.js"; // Importer les middlewares pour le cache

// Récupérer les commentaires de toutes les recettes avec cache
export const getComments = (req, res) => {
  const cacheKey = "GET:/api/comments"; // Clé de cache pour récupérer tous les commentaires

  // Vérification du cache
  cacheMiddleware(req, res, () => {
    // Si les données sont dans le cache, elles ont été déjà envoyées par le middleware cacheMiddleware
    // Sinon, on continue ici pour récupérer depuis la base de données
    Comment.find()
      .populate("user", "username") // Peupler uniquement le champ 'username' de l'utilisateur
      .populate("recipe", "title") // Peupler uniquement le champ 'title' de la recette
      .then((comments) => {
        if (!comments.length) {
          return res.status(200).json([]); // Si aucun commentaire n'est trouvé, renvoyer une liste vide
        }

        // Si des commentaires sont récupérés, les mettre en cache
        memcached.set(cacheKey, JSON.stringify(comments), 3600, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la mise en cache des commentaires:",
              err
            );
            return res.status(500).json({
              message: "Erreur lors de la mise en cache des commentaires",
            });
          }
          console.log("Commentaires mis en cache pour GET:/api/comments");
        });

        // Mise en cache des commentaires
        cacheResponse(req, res, () => {
          // Renvoie les commentaires depuis la base de données
          res.status(200).json(comments);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des commentaires depuis la base de données:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des commentaires",
        });
      });
  });
};
