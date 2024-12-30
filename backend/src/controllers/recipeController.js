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
// import { cacheData, getData, invalidateCache } from "../cache/memcached.js"; // Importer les fonctions de cache

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

// export const getRecipes = async (req, res) => {
//   try {
//     const cacheKey = "all_recipes"; // Utiliser une clé de cache pour les recettes

//     // Vérifier si les recettes sont présentes dans le cache Memcached
//     getData(cacheKey, async (err, cachedRecipes) => {
//       if (err) {
//         console.error("Erreur de récupération depuis Memcached:", err);
//       }

//       // Si les recettes sont dans le cache, les retourner
//       if (cachedRecipes) {
//         console.log("Recettes récupérées depuis le cache");
//         return res.status(200).json(JSON.parse(cachedRecipes)); // Parser la valeur JSON du cache
//       }
//       // Si les recettes ne sont pas dans le cache, récupérer depuis la base de données
//       const recipes = await Recipe.find(); // Vous pouvez ajouter des `.populate()` ici si nécessaire

//       // Si aucune recette n'est trouvée, renvoyer un tableau vide
//       if (!recipes.length) {
//         return res.status(200).json([]);
//       }

//       // Mettre les recettes dans le cache pour la durée définie (1 heure = 3600 secondes)
//       cacheData(cacheKey, JSON.stringify(recipes)); // Stocker les recettes sous forme de chaîne JSON

//       // Retourner les recettes récupérées de la base de données
//       return res.status(200).json(recipes);
//     });
//   } catch (error) {
//     console.error("Erreur lors de la récupération des recettes:", error);
//     res.status(500).json({ message: "Error retrieving recipes" });
//   }
// };

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

// // Récupérer une seule recette par son ID
// export const getRecipeById = async (req, res) => {
//   const { id } = req.params;
//   const cacheKey = `recipe_${id}`; // Utiliser l'ID comme clé de cache

//   try {
//     // Vérifier si la recette est déjà dans le cache
//     getData(cacheKey, async (err, cachedRecipe) => {
//       if (err) {
//         console.error("Erreur lors de la récupération depuis Memcached:", err);
//       }

//       // Si la recette est présente dans le cache, la renvoyer
//       if (cachedRecipe) {
//         console.log("Recette récupérée depuis le cache");
//         return res.status(200).json(JSON.parse(cachedRecipe)); // Retourner la recette du cache
//       }

//       // Si la recette n'est pas dans le cache, la récupérer depuis la base de données
//       const recipe = await Recipe.findById(id)
//         .lean() // Récupérer un objet JavaScript pur pour éviter les problèmes de sérialisation
//         .populate("category", "name")
//         .populate("ingredients", "name quantity quantity_description unit")
//         .populate("instructions", "step_number instruction");

//       // Si la recette n'est pas trouvée, renvoyer une erreur 404
//       if (!recipe) {
//         return res.status(404).json({ message: "Recette non trouvée" });
//       }

//       // Mettre la recette dans le cache pour 1 heure (3600 secondes)
//       cacheData(cacheKey, JSON.stringify(recipe)); // Stocker la recette dans le cache

//       // Retourner la recette récupérée depuis la base de données
//       return res.status(200).json(recipe);
//     });
//   } catch (error) {
//     console.error("Erreur lors de la récupération de la recette:", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

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

    // Invalider le cache des recettes après l'ajout
    // invalidateCache("all_recipes"); // Invalide le cache des recettes

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

    // Invalider le cache des recettes après la mise à jour
    // invalidateCache("all_recipes"); // Invalide le cache des recettes

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

    // Invalider le cache des recettes après la suppression
    // invalidateCache("all_recipes"); // Invalide le cache des recettes

    res.status(200).json({ message: "Recette supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

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

// Récupérer les commentaires d'une recette
export const getCommentsByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    // Chercher tous les commentaires associés à la recette
    const comments = await Comment.find({ recipe: recipeId })
      .populate("user", "name")
      .populate("recipe", "title");
    // Vérifier si des commentaires ont été trouvés
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun commentaire trouvé pour cette recette" });
    }
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des commentaires",
    });
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

// Mettre à jour un commentaire
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  // Validation des données
  const { error } = validateCommentSchema({
    content,
    recipeId: req.body.recipeId,
    userId,
  });

  // Vérifier si les données sont invalides
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((x) => x.message).join(", ") });
  }

  try {
    // Vérifier si le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Vérifier que l'utilisateur est bien celui qui a créé le commentaire
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Non autorisé à modifier ce commentaire" });
    }

    // Mettre à jour le commentaire
    comment.content = content;
    await comment.save();

    return res
      .status(200)
      .json({ message: "Commentaire mis à jour avec succès", comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du commentaire",
    });
  }
};

// Supprimer un commentaire
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    // Vérifier si le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Vérifier que l'utilisateur est bien celui qui a créé le commentaire
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Non autorisé à supprimer ce commentaire" });
    }

    // Supprimer le commentaire
    await comment.remove();

    return res
      .status(200)
      .json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression du commentaire",
    });
  }
};

// Récupérer les scores d'une recette
export const getScoresByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  console.log("Recipe ID:", recipeId);

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    const scores = await Score.find({ recipe: recipeId }).populate("user");
    if (scores.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune note trouvée pour cette recette" });
    }

    const averageScore =
      scores.reduce((sum, score) => sum + score.score, 0) / scores.length;

    return res.status(200).json({
      scores,
      averageScore: Number.parseFloat(averageScore).toFixed(2),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des scores" });
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

// Supprimer un score
export const deleteScore = async (req, res) => {
  const { scoreId } = req.params;
  const userId = req.userId; // Utilisateur authentifié

  try {
    const score = await Score.findById(scoreId);
    if (!score) {
      return res.status(404).json({ message: "Score non trouvé" });
    }

    // Vérifier que l'utilisateur est bien celui qui a ajouté ce score, ou qu'il est un administrateur
    if (
      score.user.toString() !== userId.toString() &&
      req.userRole !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Non autorisé à supprimer ce score" });
    }

    // Supprimer le score
    await score.remove();

    return res.status(200).json({ message: "Score supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du score" });
  }
};
