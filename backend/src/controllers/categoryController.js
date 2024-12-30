import Category from "../models/Category.js";
import categoryValidationSchema from "../validation/schemas/categoryValidation.js";

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
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    handleError(
      res,
      500,
      "Erreur lors de la récupération des catégories",
      error
    );
  }
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json(category);
  } catch (error) {
    handleError(
      res,
      500,
      "Erreur lors de la récupération de la catégorie",
      error
    );
  }
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
