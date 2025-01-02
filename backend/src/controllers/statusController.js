import Status from "../models/Status.js";
import statusValidationSchema from "../validation/schemas/statusValidation.js";
import { memcached } from "../cache/memcached.js"; // Importer les fonctions de cache
import {
  cacheMiddleware,
  cacheResponse,
  invalidateCache,
} from "../cache/memcached.js"; // Importer les middlewares

// Récupérer tous les statuts avec mise en cache
export const getStatus = (req, res) => {
  const cacheKey = "GET:/api/status"; // Clé de cache pour récupérer tous les statuts

  // Vérification du cache
  cacheMiddleware(req, res, () => {
    // Si les données sont dans le cache, elles ont déjà été envoyées par le middleware cacheMiddleware
    // Sinon, continue ici pour récupérer depuis la base de données
    Status.find()
      .then((status) => {
        if (!status.length) {
          return res.status(200).json([]); // Si aucun statut n'est trouvé, renvoyer une liste vide
        }

        // Si des statuts sont récupérés, les mettre en cache
        memcached.set(cacheKey, JSON.stringify(status), 3600, (err) => {
          if (err) {
            console.error("Erreur lors de la mise en cache des statuts:", err);
          } else {
            console.log("Statuts mis en cache pour GET:/api/status");
          }
        });

        // Mise en cache des statuts
        cacheResponse(req, res, () => {
          // Renvoie les statuts depuis la base de données
          res.status(200).json(status);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des statuts depuis la base de données:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des statuts",
        });
      });
  });
};

// Récupérer un statut par son ID avec mise en cache
export const getStatusById = (req, res) => {
  const { id } = req.params;
  const cacheKey = `GET:/api/status/${id}`; // Clé de cache spécifique au statut par ID

  // Vérification du cache
  cacheMiddleware(req, res, () => {
    // Si les données sont dans le cache, elles ont déjà été envoyées par le middleware cacheMiddleware
    // Sinon, continue ici pour récupérer depuis la base de données
    Status.findById(id)
      .then((status) => {
        if (!status) {
          return res.status(404).json({ message: "Statut non trouvé" });
        }

        // Mise en cache du statut pendant 1 heure (3600 secondes)
        memcached.set(cacheKey, JSON.stringify(status), 3600, (err) => {
          if (err) {
            console.error("Erreur lors de la mise en cache du statut:", err);
          } else {
            console.log(`Statut mis en cache pour ${cacheKey}`);
          }
        });

        // Mise en cache des statuts
        cacheResponse(req, res, () => {
          // Renvoie le statut depuis la base de données
          res.status(200).json(status);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du statut depuis la base de données:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération du statut",
        });
      });
  });
};

// Créer un statut
export const createStatus = async (req, res) => {
  try {
    const { status_name } = req.body;
    const { error } = statusValidationSchema({ status_name });

    // Si la validation échoue, renvoyer l'erreur
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Créer un nouveau statut
    const newStatus = new Status({ status_name });

    // Sauvegarder le statut dans la base de données
    await newStatus.save();

    // Utiliser le middleware invalidateCache pour invalider le cache de la liste des statuts
    const cacheKey = "GET:/api/status"; // Clé de cache pour la liste des statuts
    invalidateCache(req, res, cacheKey, () => {
      console.log("Cache pour la liste des statuts invalidé avec succès");
    });

    // Réponse après la création du statut
    res.status(201).json({
      message: "Statut créé avec succès",
      status: newStatus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur du serveur",
      error: error.message,
    });
  }
};
