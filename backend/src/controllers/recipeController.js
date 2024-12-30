import Recipe from "../models/Recipe.js";
import Ingredient from "../models/Ingredient.js";
import Instruction from "../models/Instruction.js";
import Category from "../models/Category.js";
import {
  addRecipeSchema,
  updateRecipeSchema,
} from "../validation/schemas/recipeValidation.js";
import addIngredientSchema from "../validation/schemas/ingredientValidation.js";
import addInstructionSchema from "../validation/schemas/instructionValidation.js";
import categoryValidationSchema from "../validation/schemas/categoryValidation.js";
import Comment from "../models/Comment.js";
import validateCommentSchema from "../validation/schemas/commentValidation.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import scoreValidationSchema from "../validation/schemas/scoreValidation.js";

// Récupérer toutes les recettes avec les ingrédients et instructions peuplés
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    // Si aucune recette n'est trouvée, renvoyer un tableau vide
    if (!recipes.length) {
      return res.status(200).json([]);
    }
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
    res.status(500).json({ message: "Error retrieving recipes" });
  }
};

// Récupérer une seule recette par son ID
export const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id)
      // Peupler la catégorie avec le champ 'name'
      .populate("category", "name")
      // Peupler les ingrédients avec les champs spécifiés
      .populate("ingredients", "name quantity quantity_description unit")
      // Peupler les instructions avec les champs spécifiés
      .populate("instructions", "step_number instruction");

    // Si la recette n'est pas trouvée, renvoyer une erreur 404
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les recettes par catégorie
export const getRecipesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const recipes = await Recipe.find({ category: categoryId })
      // Peupler la catégorie avec le champ 'name'
      .populate("category", "name")
      // Peupler les ingrédients avec les champs spécifiés
      .populate("ingredients", "name quantity quantity_description unit")
      // Peupler les instructions avec les champs spécifiés
      .populate("instructions", "step_number instruction");
    // Vérifier si des recettes ont été trouvées
    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune recette trouvée pour cette catégorie" });
    }
    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des recettes" });
  }
};

export const addRecipe = async (req, res) => {
  // Récupérer les données de la requête
  const {
    title,
    description,
    anecdote,
    ingredients,
    instructions,
    source,
    category,
    image,
  } = req.body;

  // Valider les données de la recette avec Joi
  const { error: recipeError } = addRecipeSchema.validate({
    title,
    description,
    anecdote,
    ingredients,
    instructions,
    source,
  });

  // Si la validation échoue, renvoyer une erreur
  if (recipeError) {
    return res.status(400).json({ message: recipeError.details[0].message });
  }

  try {
    // Valider et ajouter les ingrédients
    const validatedIngredients = [];
    for (const ingredient of ingredients) {
      const { error: ingredientError } =
        addIngredientSchema.validate(ingredient);
      if (ingredientError) {
        return res.status(400).json({
          message: `Erreur dans l'ingrédient: ${ingredientError.details[0].message}`,
        });
      }
      // Créer un nouvel ingrédient
      const newIngredient = new Ingredient(ingredient);
      // Enregistrer l'ingrédient dans la base de données
      await newIngredient.save();
      // Ajouter l'ingrédient à la liste des ingrédients validés
      validatedIngredients.push(newIngredient._id);
    }

    // Valider et ajouter les instructions
    const validatedInstructions = [];
    for (const instruction of instructions) {
      const { error: instructionError } =
        addInstructionSchema.validate(instruction);
      if (instructionError) {
        return res.status(400).json({
          message: `Erreur dans l'instruction: ${instructionError.details[0].message}`,
        });
      }
      // Créer une nouvelle instruction
      const newInstruction = new Instruction(instruction);
      // Enregistrer l'instruction dans la base de données
      await newInstruction.save();
      // Ajouter l'instruction à la liste des instructions validées
      validatedInstructions.push(newInstruction._id);
    }

    // Valider et ajouter la catégorie
    const { error: categoryError } =
      categoryValidationSchema.validate(category);
    if (categoryError) {
      return res.status(400).json({
        message: `Erreur dans la catégorie: ${categoryError.details[0].message}`,
      });
    }

    // Chercher une catégorie existante dans la base de données
    const existingCategory = await Category.findOne({ name: category.name });

    if (!existingCategory) {
      return res.status(400).json({ message: "Catégorie non trouvée." });
    }

    // Assigner l'ID de la catégorie trouvée à la recette
    const validatedCategory = existingCategory._id;

    // Créer une nouvelle recette avec les ingrédients et instructions validés
    const newRecipe = new Recipe({
      title,
      description,
      anecdote,
      source,
      category: validatedCategory, // Lier la catégorie existante à la recette
      ingredients: validatedIngredients, // Lier les ingrédients à la recette
      instructions: validatedInstructions, // Lier les instructions à la recette
      image,
    });

    // Sauvegarder la recette
    await newRecipe.save();

    res.status(201).json({
      message: "Recette ajoutée avec succès",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la recette:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour une recette existante avec validation des ingrédients, instructions et catégorie existante
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    anecdote,
    ingredients,
    instructions,
    source,
    category,
    image,
  } = req.body;

  // Valider les données de la recette avec Joi
  const { error: recipeError } = updateRecipeSchema.validate({
    title,
    description,
    anecdote,
    ingredients,
    instructions,
    source,
  });

  if (recipeError) {
    return res.status(400).json({ message: recipeError.details[0].message });
  }

  try {
    // Trouver la recette à mettre à jour
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    // Mettre à jour les champs de la recette
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (anecdote) recipe.anecdote = anecdote;
    if (source) recipe.source = source;
    if (image) recipe.image = image;

    // Validation et mise à jour de la catégorie existante
    if (category) {
      const { error: categoryError } =
        categoryValidationSchema.validate(category);
      if (categoryError) {
        return res.status(400).json({
          message: `Erreur dans la catégorie: ${categoryError.details[0].message}`,
        });
      }

      // Chercher une catégorie existante dans la base de données
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        return res.status(400).json({
          message:
            "Catégorie non trouvée. Veuillez utiliser une catégorie existante.",
        });
      }

      // Assigner l'ID de la catégorie existante à la recette
      recipe.category = existingCategory._id;
    }

    // Mettre à jour les ingrédients (s'ils sont envoyés)
    if (ingredients) {
      const validatedIngredients = [];
      for (const ingredient of ingredients) {
        const { error: ingredientError } =
          addIngredientSchema.validate(ingredient);
        if (ingredientError) {
          return res.status(400).json({
            message: `Erreur dans l'ingrédient: ${ingredientError.details[0].message}`,
          });
        }
        const newIngredient = new Ingredient(ingredient);
        await newIngredient.save();
        validatedIngredients.push(newIngredient._id); // Ajouter l'ID des nouveaux ingrédients
      }
      recipe.ingredients = validatedIngredients; // Mettre à jour les ingrédients
    }

    // Mettre à jour les instructions (s'ils sont envoyés)
    if (instructions) {
      const validatedInstructions = [];
      for (const instruction of instructions) {
        const { error: instructionError } =
          addInstructionSchema.validate(instruction);
        if (instructionError) {
          return res.status(400).json({
            message: `Erreur dans l'instruction: ${instructionError.details[0].message}`,
          });
        }
        const newInstruction = new Instruction(instruction);
        await newInstruction.save();
        validatedInstructions.push(newInstruction._id); // Ajouter l'ID des nouvelles instructions
      }
      recipe.instructions = validatedInstructions; // Mettre à jour les instructions
    }

    // Sauvegarder la recette
    await recipe.save();

    res.status(200).json({
      message: "Recette mise à jour avec succès",
      recipe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// supprimer une recette (les ingrédients et instructions ne sont pas supprimés ici)
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    res.status(200).json({ message: "Recette supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Rechercher des recettes par titre, source ou catégorie
// Recherche de recettes par titre, source ou catégorie
export const searchRecipes = async (req, res) => {
  // Extraire les critères de recherche depuis le corps de la requête
  const { title, source, category } = req.body;

  // Créer un objet de filtre
  const filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" }; // Recherche insensible à la casse pour le titre
  }

  if (source) {
    filter.source = { $regex: source, $options: "i" }; // Recherche insensible à la casse pour la source
  }

  if (category) {
    try {
      // Chercher la catégorie dans la base de données (vérifier si l'ID ou le nom est passé)
      const existingCategory = await Category.findOne({ name: category });
      if (existingCategory) {
        filter.category = existingCategory._id; // Utiliser l'ID de la catégorie
      } else {
        return res.status(400).json({ message: "Catégorie non trouvée" });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la catégorie:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  try {
    // Recherche dans la base de données avec les filtres appliqués
    const recipes = await Recipe.find(filter).populate("category", "name"); // Peuple la catégorie avec son nom

    if (recipes.length === 0) {
      return res.status(404).json({ message: "Aucune recette trouvée" });
    }

    return res.status(200).json(recipes);
  } catch (error) {
    console.error("Erreur lors de la recherche des recettes:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter un commentaire
export const addComment = async (req, res) => {
  // Récupérer les données du corps de la requête
  const { content, recipeId } = req.body;
  // Récupérer l'ID de l'utilisateur connecté
  const userId = req.userId;

  // Validation des données
  const { error } = validateCommentSchema({ content, recipeId, userId });
  // Si les données sont invalides, renvoyer une réponse d'erreur
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((x) => x.message).join(", ") });
  }

  try {
    // Vérifier si la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    // Créer un nouveau commentaire
    const newComment = new Comment({
      content,
      user: userId,
      recipe: recipeId,
    });

    // Sauvegarder le commentaire
    await newComment.save();

    return res
      .status(201)
      .json({ message: "Commentaire ajouté avec succès", comment: newComment });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de l'ajout du commentaire" });
  }
};

// Ajouter ou mettre à jour une note pour une recette
export const addOrUpdateScore = async (req, res) => {
  const { score, recipeId } = req.body;
  const userId = req.userId;

  try {
    // Validation avec Joi
    await scoreValidationSchema.validateAsync({ score, recipeId, userId });

    // Vérifier si la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Utiliser la méthode statique updateOrCreate pour gérer l'ajout ou la mise à jour du score
    const updatedScore = await Score.updateOrCreate(userId, recipeId, score);

    return res.status(updatedScore.isNew ? 201 : 200).json({
      message: updatedScore.isNew
        ? "Score ajouté avec succès"
        : "Score mis à jour avec succès",
      score: updatedScore,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: "Données invalides",
        errors: error.details.map((err) => ({
          message: err.message,
          path: err.path,
        })),
      });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour de la note" });
  }
};
