import Recipe from '../models/Recipe.js';

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

// ajouter une nouvelle recette
export const addRecipe = async (req, res) => {
    const { title, description, anecdote, ingredients, instructions, source } = req.body;
    try {
        const newRecipe = new Recipe({
            title,
            description,
            anecdote,
            ingredients,
            instructions,
            source
        });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
// mettre à jour une recette existante
export const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, anecdote, ingredients, instructions, source } = req.body;
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
            title,
            description,
            anecdote,
            ingredients,
            instructions,
            source
        }, { new: true });  // Renvoie la recette mise à jour   
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
    };
    // supprimer une recette
    export const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }
        res.status(200).json({ message: 'Recette supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la recette:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
