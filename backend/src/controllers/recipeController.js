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
import { memcached } from "../cache/memcached.js"; // Importer les fonctions de cache
import {
  cacheMiddleware,
  cacheResponse,
  invalidateCache,
} from "../cache/memcached.js"; // Importer les middlewares

// Récupérer toutes les recettes avec les ingrédients et instructions peuplés
export const getRecipes = (req, res) => {
  const cacheKey = "GET:/api/recipes"; // Clé de cache pour récupérer toutes les recettes

  // Vérification du cache
  cacheMiddleware(req, res, () => {
    // Si les données sont dans le cache, elles ont été déjà envoyées par le middleware cacheMiddleware
    // Sinon, continue ici pour récupérer depuis la base de données
    Recipe.find()
      .then((recipes) => {
        if (!recipes.length) {
          return res.status(200).json([]); // Si aucune recette n'est trouvée, renvoyer une liste vide
        }

        // Si des recettes sont récupérées, les mettre en cache
        memcached.set(cacheKey, JSON.stringify(recipes), 3600, (err) => {
          if (err) {
            console.error("Erreur lors de la mise en cache:", err);
          } else {
            console.log("Recettes mises en cache pour GET:/api/recipes");
          }
        });

        // Mise en cache des recettes
        cacheResponse(req, res, () => {
          // Renvoie les recettes depuis la base de données
          res.status(200).json(recipes);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des recettes depuis la base de données:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des recettes",
        });
      });
  });
};
// Récupérer une recette par son ID
export const getRecipeById = (req, res) => {
  const { id } = req.params;
  const cacheKey = `GET:/api/recipes/${id}`;

  // Vérification dans le cache
  cacheMiddleware(req, res, () => {
    // Si la recette est dans le cache, elle sera déjà envoyée
    // Sinon, la suite du code est exécutée pour récupérer la recette de la base de données

    Recipe.findById(id)
      .populate("category", "name")
      .populate("ingredients", "name quantity quantity_description unit")
      .populate("instructions", "step_number instruction")
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).json({ message: "Recette non trouvée" });
        }

        // Mise en cache de la recette pendant 1 heure (3600 secondes)
        memcached.set(cacheKey, JSON.stringify(recipe), 3600, (err) => {
          if (err) {
            // Log de l'erreur sans interrompre l'exécution
            console.error(
              "Erreur lors de la mise en cache de la recette:",
              err
            );
          } else {
            console.log(`Recette mise en cache pour ${cacheKey}`);
          }
        });

        // Répondre à la requête avec la recette, après l'avoir mise en cache
        res.status(200).json(recipe);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de la recette:", error);
        res.status(500).json({ message: "Erreur serveur" });
      });
  });
};

// Récupérer les recettes par catégorie
export const getRecipesByCategory = (req, res) => {
  const { id } = req.params;
  const cacheKey = `GET:/api/recipes/category/${id}`; // Clé de cache spécifique à la catégorie

  // Vérification dans le cache
  cacheMiddleware(req, res, () => {
    // Si les recettes sont en cache, elles seront déjà renvoyées.
    // Sinon, la suite du code est exécutée pour récupérer les recettes de la base de données

    // Récupérer les recettes depuis la base de données
    Recipe.find({ category: id })
      .populate("category", "name")
      .populate("ingredients", "name quantity quantity_description unit")
      .populate("instructions", "step_number instruction")
      .then((recipes) => {
        if (recipes.length === 0) {
          return res
            .status(404)
            .json({ message: "Aucune recette trouvée pour cette catégorie" });
        }

        // Mise en cache des recettes pendant 1 heure (3600 secondes)
        memcached.set(cacheKey, JSON.stringify(recipes), 3600, (err) => {
          if (err) {
            console.error("Erreur lors de la mise en cache des recettes:", err);
          } else {
            console.log(`Recettes mises en cache pour ${cacheKey}`);
          }
        });

        // Mise en cache des recettes
        cacheResponse(req, res, () => {
          // Renvoie les recettes depuis la base de données
          res.status(200).json(recipes);
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des recettes:", error);
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des recettes",
        });
      });
  });
};

// Récupérer les commentaires d'une recette
export const getCommentsByRecipe = (req, res) => {
  const { id } = req.params;

  // Vérification dans le cache avant de procéder
  cacheMiddleware(req, res, () => {
    // Si les commentaires sont en cache, ils seront renvoyés.
    // Sinon, on va les récupérer depuis la base de données

    // Récupérer les commentaires depuis la base de données
    Comment.find({ recipe: id })
      .populate("user", "name")
      .populate("recipe", "title")
      .then((comments) => {
        if (comments.length === 0) {
          return res
            .status(404)
            .json({ message: "Aucun commentaire trouvé pour cette recette" });
        }

        // Mise en cache des commentaires pendant 1 heure (3600 secondes)
        // Utilisation de cacheResponse pour mettre en cache après envoi de la réponse
        cacheResponse(req, res, () => {
          // Renvoie les commentaires depuis la base de données
          res.status(200).json(comments);
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des commentaires:",
          error
        );
        res.status(500).json({
          message: "Erreur serveur lors de la récupération des commentaires",
        });
      });
  });
};

// Récupérer les scores d'une recette
export const getScoresByRecipe = (req, res) => {
  const { id } = req.params;

  // Vérification dans le cache avant de procéder
  cacheMiddleware(req, res, () => {
    // Si les scores sont en cache, ils seront renvoyés.
    // Sinon, on va les récupérer depuis la base de données

    // Récupérer les scores depuis la base de données
    Score.find({ recipe: id })
      .populate("user")
      .then((scores) => {
        if (scores.length === 0) {
          return res
            .status(404)
            .json({ message: "Aucune note trouvée pour cette recette" });
        }

        const averageScore =
          scores.reduce((sum, score) => sum + score.score, 0) / scores.length;

        // Mise en cache des scores pendant 1 heure (3600 secondes)
        // Utilisation de cacheResponse pour mettre en cache après envoi de la réponse
        cacheResponse(req, res, () => {
          // Renvoie les scores depuis la base de données, y compris la note moyenne
          res.status(200).json({
            scores,
            averageScore: Number.parseFloat(averageScore).toFixed(2),
          });
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des scores:", error);
        return res.status(500).json({
          message: "Erreur serveur lors de la récupération des scores",
        });
      });
  });
};

// Ajouter une nouvelle recette
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

    // Invalider les cache de recettes générales et spécifiques (par exemple, par ID, par catégorie)
    invalidateCache({ method: "GET", originalUrl: "/api/recipes" }); // Invalidation du cache global des recettes
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/${newRecipe._id}`,
    }); // Invalidation du cache de cette recette

    // Si vous avez un cache spécifique pour les catégories, invalidez également
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/category/${validatedCategory}`,
    });

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
    invalidateCache({ method: "GET", originalUrl: `/api/recipes/${id}` }); // Invalider le cache de la recette mise à jour
    invalidateCache({ method: "GET", originalUrl: "/api/recipes" }); // Invalider le cache global des recettes
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/category/${recipe.category}`,
    }); // Invalider le cache de la catégorie de cette recette

    res.status(200).json({
      message: "Recette mise à jour avec succès",
      recipe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une recette (les ingrédients et instructions ne sont pas supprimés ici)
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    // Invalider le cache des recettes après la suppression
    invalidateCache({ method: "GET", originalUrl: `/api/recipes/${id}` }); // Invalider le cache de la recette supprimée
    invalidateCache({ method: "GET", originalUrl: "/api/recipes" }); // Invalider le cache global des recettes
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/category/${deletedRecipe.category}`,
    }); // Invalider le cache de la catégorie de cette recette

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

    // Invalider le cache des recettes pour cette recherche
    invalidateCache({ method: "POST", originalUrl: "/api/recipes/search" }); // Invalider le cache des résultats de recherche

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

    // Invalider le cache des commentaires pour cette recette après l'ajout du commentaire
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/${recipeId}/comments`,
    });

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

    // Invalider le cache des commentaires de la recette après la mise à jour du commentaire
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/${comment.recipe}/comments`,
    });

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

    // Invalider le cache des commentaires de la recette après la suppression
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/${comment.recipe}/comments`,
    });

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

    // Invalider le cache des scores pour cette recette après la mise à jour ou l'ajout
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/${recipeId}/scores`,
    });

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

    // Invalider le cache des scores pour la recette concernée après la suppression
    invalidateCache({
      method: "GET",
      originalUrl: `/api/recipes/${score.recipe}/scores`,
    });

    return res.status(200).json({ message: "Score supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du score" });
  }
};
