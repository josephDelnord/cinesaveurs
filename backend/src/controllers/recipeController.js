import Recipe from '../models/Recipe.js';
import { addRecipeSchema, updateRecipeSchema } from '../validation/schemas/recipeValidation.js';

// récupérer toutes les recettes
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();  // Récupère toutes les recettes
        res.status(200).json(recipes);  // Renvoie les données au format JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des recettes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// récupérer une seule recette par son ID
export const getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id);  // Récupère la recette par son ID
        if (!recipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Erreur lors de la récupération de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// récupérer les recettes par catégorie
export const getRecipesByCategory = async (req, res) => {
    const { categoryId } = req.params;  // Récupérer l'ID de la catégorie depuis les paramètres de l'URL
  
    try {
      // Chercher toutes les recettes associées à la catégorie donnée
      const recipes = await Recipe.find({ category: categoryId }).populate('category');
  
      if (recipes.length === 0) {
        return res.status(404).json({ message: 'Aucune recette trouvée pour cette catégorie' });
      }
  
      return res.status(200).json(recipes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération des recettes' });
    }
  };

// ajouter une nouvelle recette
export const addRecipe = async (req, res) => {
    const { title, description, anecdote, ingredients, instructions, source } = req.body;

    // Valider les données avec Joi
    const { error } = addRecipeSchema.validate({
        title, description, anecdote, ingredients, instructions, source
    });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const newRecipe = new Recipe({
            title,
            description,
            anecdote,
            ingredients,
            instructions,
            source, 
            category: req.body.category || []  // Ajouter la catégorie si elle est fournie
        });

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

// mettre à jour une recette existante
export const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, anecdote, ingredients, instructions, source } = req.body;

    // Valider les données avec Joi
    const { error } = updateRecipeSchema.validate({
        title, description, anecdote, ingredients, instructions, source
    });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Trouver la recette à mettre à jour
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }

        // Mettre à jour les champs avec les données fournies
        if (title) recipe.title = title;
        if (description) recipe.description = description;
        if (anecdote) recipe.anecdote = anecdote;
        if (ingredients) recipe.ingredients = ingredients;
        if (instructions) recipe.instructions = instructions;
        if (source) recipe.source = source;

        // Sauvegarder les changements dans la base de données
        await recipe.save();

        // Réponse de succès
        res.status(200).json({
            message: 'Recette mise à jour avec succès',
            recipe,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// supprimer une recette
export const deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        // Trouver et supprimer la recette
        const deletedRecipe = await Recipe.findByIdAndDelete(id); // Utilisation de findByIdAndDelete
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
