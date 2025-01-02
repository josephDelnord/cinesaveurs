import Category from "../models/Category.js";
import categoryValidationSchema from "../validation/schemas/categoryValidation.js";
import { memcached } from "../cache/memcached.js"; // Importer les fonctions de cache
import {
  cacheMiddleware,
  cacheResponse,
  invalidateCache,
} from "../cache/memcached.js"; // Importer les middlewares de cache

// Fonction utilitaire pour gérer les erreurs
const handleError = (res, statusCode, message, error) => {
  console.error(message, error);
  return res.status(statusCode).json({ message, error });
};

// Fonction pour valider les données d'une catégorie
const validateCategory = (categoryData) => {
  const { error } = categoryValidationSchema.validate(categoryData);
  if (error) {
    return error;
  }
  return null;
};

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
  const cacheKey = "GET:/api/categories"; // Clé de cache pour récupérer toutes les catégories

  // Vérification du cache
  cacheMiddleware(req, res, async () => {
    try {
      // Si les données sont dans le cache, elles ont été déjà envoyées par le middleware cacheMiddleware
      // Sinon, on récupère les catégories depuis la base de données
      const categories = await Category.find();

      // Si aucune catégorie n'est trouvée, renvoyer une liste vide
      if (!categories.length) {
        return res.status(200).json([]);
      }

      // Mise en cache des catégories pour les requêtes futures
      memcached.set(cacheKey, JSON.stringify(categories), 3600, (err) => {
        if (err) {
          console.error("Erreur lors de la mise en cache:", err);
        } else {
          console.log("Catégories mises en cache pour GET:/api/categories");
        }
      });

      // Mise en cache des réponses
      cacheResponse(req, res, () => {
        // Renvoie les catégories depuis la base de données
        res.status(200).json(categories);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des catégories",
      });
    }
  });
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `GET:/api/categories/${id}`; // Clé de cache spécifique à la catégorie

  // Vérification du cache
  cacheMiddleware(req, res, async () => {
    try {
      // Vérifier si les données sont dans le cache
      // Si elles sont en cache, elles seront déjà envoyées par le middleware cacheMiddleware
      const cachedCategory = await memcached.get(cacheKey);
      if (cachedCategory) {
        console.log("Catégorie récupérée depuis le cache");
        return res.status(200).json(JSON.parse(cachedCategory));
      }

      // Si la catégorie n'est pas en cache, on la récupère depuis la base de données
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      // Mettre la catégorie en cache pour les requêtes futures
      memcached.set(cacheKey, JSON.stringify(category), 3600, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la mise en cache de la catégorie:",
            err
          );
        } else {
          console.log(`Catégorie ${id} mise en cache`);
        }
      });

      // Mise en cache des réponses
      cacheResponse(req, res, () => {
        // Renvoie la catégorie récupérée depuis la base de données
        res.status(200).json(category);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur serveur lors de la récupération de la catégorie",
      });
    }
  });
};

// Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation des données
    const validationError = validateCategory(req.body);
    if (validationError) {
      return res
        .status(400)
        .json({ message: validationError.details[0].message });
    }

    // Vérification de l'existence de la catégorie
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Cette catégorie existe déjà" });
    }

    // Création de la nouvelle catégorie
    const category = new Category({ name });
    await category.save();

    // Invalider le cache des catégories pour forcer la mise à jour lors des prochaines requêtes
    invalidateCache("GET:/api/categories"); // Invalider le cache des catégories

    return res.status(201).json(category);
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de la catégorie", error });
  }
};

// Mettre à jour une catégorie par ID
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validation des données
  const validationError = validateCategory(req.body);

  // Si les données ne sont pas valides, on renvoie un message d'erreur
  if (validationError) {
    return res
      .status(400)
      .json({ message: validationError.details[0].message });
  }

  try {
    // Mise à jour de la catégorie
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    // Si la catégorie n'est pas trouvée, on renvoie une erreur
    if (!updatedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Invalider le cache des catégories après la mise à jour
    invalidateCache("GET:/api/categories");

    // Si la mise à jour est réussie, on renvoie la catégorie mise à jour
    res.status(200).json(updatedCategory);
  } catch (error) {
    handleError(
      res,
      500,
      "Erreur lors de la mise à jour de la catégorie",
      error
    );
  }
};

// Supprimer une catégorie par ID
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Invalider le cache des catégories après la suppression
    invalidateCache("GET:/api/categories");

    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    handleError(
      res,
      500,
      "Erreur lors de la suppression de la catégorie",
      error
    );
  }
};
