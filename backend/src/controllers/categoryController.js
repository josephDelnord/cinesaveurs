import Category from '../models/Category.js';
import categoryValidationSchema from '../validation/schemas/categoryValidation.js';

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error });
    }
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie', error });
    }
};

// Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
    // Validation des données entrantes avec Joi
    const { error } = categoryValidationSchema.validate(req.body);

    // Si la validation échoue, renvoyer un message d'erreur
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name } = req.body;

    try {
        // Vérifier si la catégorie existe déjà
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Cette catégorie existe déjà' });
        }

        // Créer et sauvegarder la nouvelle catégorie
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la catégorie', error });
    }
};

// Mettre à jour une catégorie par ID
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        } 
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error });
    }
};

// Supprimer une catégorie par ID
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByI(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error });
    }
};