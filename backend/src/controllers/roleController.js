import Role, { ROLES } from '../models/Role.js';
import roleValidationSchema from '../validation/schemas/roleValidation.js';

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rôles', error });
    }
};

// Créer un nouveau rôle
export const createRole = async (req, res) => {
    // Valider les données avec Joi
    const { error } = roleValidationSchema.validate(req.body);

    // Si la validation échoue, renvoyer l'erreur
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { role } = req.body;

    try {
        // Vérifier si le rôle existe déjà dans la base de données
        const existingRole = await Role.findOne({ role });
        if (existingRole) {
            return res.status(400).json({ message: 'Ce rôle existe déjà' });
        }

        const newRole = new Role({ role });
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du rôle', error });
    }
};

// Supprimer un rôle par son ID
export const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRole = await Role.findByIdAndDelete(id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.status(200).json({ message: 'Rôle supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du rôle', error });
    }
};

// Récupérer les rôles possibles (enum)
export const getRolesEnum = (req, res) => {
    res.status(200).json(Object.values(ROLES));
};
