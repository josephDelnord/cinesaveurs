import Role from "../models/Role.js";
import roleValidationSchema from "../validation/schemas/roleValidation.js";
import { memcached } from "../cache/memcached.js"; // Importer les fonctions de cache
import {
  cacheMiddleware,
  cacheResponse,
  invalidateCache,
} from "../cache/memcached.js"; // Importer les middlewares cache

// Récupérer tous les rôles avec cache
export const getAllRoles = (req, res) => {
  const cacheKey = "GET:/api/roles"; // Clé de cache pour récupérer les rôles

  // Vérification du cache
  cacheMiddleware(req, res, () => {
    // Si les données sont dans le cache, elles ont été déjà envoyées par le middleware cacheMiddleware
    // Sinon, continuer ici pour récupérer depuis la base de données
    Role.find()
      .then((roles) => {
        if (!roles.length) {
          return res.status(200).json([]); // Si aucun rôle n'est trouvé, renvoyer une liste vide
        }

        // Mettre en cache les rôles récupérés
        memcached.set(cacheKey, JSON.stringify(roles), 3600, (err) => {
          if (err) {
            console.error("Erreur lors de la mise en cache:", err);
          } else {
            console.log("Rôles mis en cache pour GET:/api/roles");
          }
        });

        // Réponse avec les rôles depuis la base de données
        cacheResponse(req, res, () => {
          res.status(200).json(roles);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des rôles depuis la base de données:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des rôles",
        });
      });
  });
};

// Créer un nouveau rôle
export const createRole = async (req, res) => {
  // Valider les données avec Joi
  const { error } = roleValidationSchema.validate(req.body);

  // Si la validation échoue, renvoyer l'erreur
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { role_name } = req.body;

  try {
    // Vérifier si le rôle existe déjà dans la base de données
    const existingRole = await Role.findOne({ role_name });
    if (existingRole) {
      return res.status(400).json({ message: "Ce rôle existe déjà" });
    }

    const newRole = new Role({ role_name });
    await newRole.save();

    // Invalider le cache des rôles après la création
    invalidateCache("GET:/api/roles");

    res.status(201).json(newRole);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du rôle", error });
  }
};

// Supprimer un rôle par son ID
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    // Invalider le cache des rôles après la suppression
    invalidateCache("GET:/api/roles");

    res.status(200).json({ message: "Rôle supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du rôle", error });
  }
};
