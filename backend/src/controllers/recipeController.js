import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';
import Instruction from '../models/Instruction.js';
import { addRecipeSchema, updateRecipeSchema } from '../validation/schemas/recipeValidation.js';
import addIngredientSchema from '../validation/schemas/ingredientValidation.js';
import addInstructionSchema from '../validation/schemas/instructionValidation.js';

// Récupérer toutes les recettes avec les ingrédients et instructions peuplés
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('category', 'name')  // Peupler la catégorie
            .populate('ingredients')  // Peupler les ingrédients
            .populate('instructions');  // Peupler les instructions
            if (!recipes.length) {
                return res.status(200).json([]); // Retourne un tableau vide si aucune recette n'est trouvée
              }
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Erreur lors de la récupération des recettes:', error);
        res.status(500).json({ message: 'Error retrieving recipes' });
    }
};

// Récupérer une seule recette par son ID
export const getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id)
            .populate('category', 'name')  // Peupler la catégorie
            .populate('ingredients')  // Peupler les ingrédients
            .populate('instructions');  // Peupler les instructions

        if (!recipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }

        res.status(200).json(recipe);  // Renvoie la recette avec la catégorie peuplée
    } catch (error) {
        console.error('Erreur lors de la récupération de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les recettes par catégorie
export const getRecipesByCategory = async (req, res) => {
    const { categoryId } = req.params; 
  
    try {
        const recipes = await Recipe.find({ category: categoryId })
            .populate('category', 'name')  // Peupler la catégorie
            .populate('ingredients')  // Peupler les ingrédients
            .populate('instructions');  // Peupler les instructions
  
        if (recipes.length === 0) {
            return res.status(404).json({ message: 'Aucune recette trouvée pour cette catégorie' });
        }
  
        return res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur lors de la récupération des recettes' });
    }
};

// Ajouter une nouvelle recette avec validation des ingrédients et instructions
export const addRecipe = async (req, res) => {
    const { title, description, anecdote, ingredients, instructions, source, category, image } = req.body;

    // Valider les données de la recette avec Joi
    const { error: recipeError } = addRecipeSchema.validate({
        title, description, anecdote, ingredients, instructions, source
    });

    if (recipeError) {
        return res.status(400).json({ message: recipeError.details[0].message });
    }

    try {
        // Valider et ajouter les ingrédients
        const validatedIngredients = [];
        for (const ingredient of ingredients) {
            const { error: ingredientError } = addIngredientSchema.validate(ingredient);
            if (ingredientError) {
                return res.status(400).json({ message: `Erreur dans l'ingrédient: ${ingredientError.details[0].message}` });
            }
            const newIngredient = new Ingredient(ingredient);
            await newIngredient.save();
            validatedIngredients.push(newIngredient._id); // Ajouter l'ID à la liste des ingrédients
        }

        // Valider et ajouter les instructions
        const validatedInstructions = [];
        for (const instruction of instructions) {
            const { error: instructionError } = addInstructionSchema.validate(instruction);
            if (instructionError) {
                return res.status(400).json({ message: `Erreur dans l'instruction: ${instructionError.details[0].message}` });
            }
            const newInstruction = new Instruction(instruction);
            await newInstruction.save();
            validatedInstructions.push(newInstruction._id); // Ajouter l'ID à la liste des instructions
        }

        // Créer la recette avec les ObjectId des ingrédients et instructions validés
        const newRecipe = new Recipe({
            title,
            description,
            anecdote,
            source,
            category,
            ingredients: validatedIngredients,  // Lier les ingrédients à la recette
            instructions: validatedInstructions,  // Lier les instructions à la recette
            image,
        });

        // Sauvegarder la recette
        await newRecipe.save();

        res.status(201).json({
            message: 'Recette ajoutée avec succès',
            recipe: newRecipe,
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour une recette existante avec validation des ingrédients et instructions
export const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, anecdote, ingredients, instructions, source, category, image } = req.body;

    // Valider les données de la recette avec Joi
    const { error: recipeError } = updateRecipeSchema.validate({
        title, description, anecdote, ingredients, instructions, source
    });

    if (recipeError) {
        return res.status(400).json({ message: recipeError.details[0].message });
    }

    try {
        // Trouver la recette à mettre à jour
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }

        // Mettre à jour les champs de la recette
        if (title) recipe.title = title;
        if (description) recipe.description = description;
        if (anecdote) recipe.anecdote = anecdote;
        if (source) recipe.source = source;
        if (category) recipe.category = category;
        if (image) recipe.image = image;

        // Mettre à jour les ingrédients (s'ils sont envoyés)
        if (ingredients) {
            const validatedIngredients = [];
            for (const ingredient of ingredients) {
                const { error: ingredientError } = addIngredientSchema.validate(ingredient);
                if (ingredientError) {
                    return res.status(400).json({ message: `Erreur dans l'ingrédient: ${ingredientError.details[0].message}` });
                }
                const newIngredient = new Ingredient(ingredient);
                await newIngredient.save();
                validatedIngredients.push(newIngredient._id); // Ajouter l'ID des nouveaux ingrédients
            }
            recipe.ingredients = validatedIngredients;  // Mettre à jour les ingrédients
        }

        // Mettre à jour les instructions (s'ils sont envoyés)
        if (instructions) {
            const validatedInstructions = [];
            for (const instruction of instructions) {
                const { error: instructionError } = addInstructionSchema.validate(instruction);
                if (instructionError) {
                    return res.status(400).json({ message: `Erreur dans l'instruction: ${instructionError.details[0].message}` });
                }
                const newInstruction = new Instruction(instruction);
                await newInstruction.save();
                validatedInstructions.push(newInstruction._id); // Ajouter l'ID des nouvelles instructions
            }
            recipe.instructions = validatedInstructions;  // Mettre à jour les instructions
        }

        // Sauvegarder la recette
        await recipe.save();

        res.status(200).json({
            message: 'Recette mise à jour avec succès',
            recipe,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// supprimer une recette (les ingrédients et instructions ne sont pas supprimés ici)
export const deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        // Trouver et supprimer la recette
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }

        res.status(200).json({ message: 'Recette supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Rechercher des recettes par titre, source ou catégorie
export const searchRecipes = async (req, res) => {
    // Extraire les critères de recherche depuis le corps de la requête
    const { title, source, category } = req.body;

    // Créer un objet de filtre
    const filter = {};

    // Ajouter des conditions de filtre selon les critères envoyés dans la requête
    if (title) filter.title = { $regex: title, $options: 'i' }; // Recherche insensible à la casse pour le titre
    if (source) filter.source = { $regex: source, $options: 'i' }; // Recherche insensible à la casse pour la source
    if (category) filter.category = { $regex: category, $options: 'i' }; // Recherche insensible à la casse pour la catégorie

    try {
        // Effectuer la recherche dans la base de données avec les filtres appliqués
        const recipes = await Recipe.find(filter);

        // Vérifier si des recettes ont été trouvées
        if (recipes.length === 0) {
            return res.status(404).json({ message: 'Aucune recette trouvée' });
        }

        // Retourner les recettes trouvées
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Erreur lors de la recherche des recettes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
