import Status from '../models/Status.js';
import statusValidationSchema from '../validation/schemas/statusValidation.js';

// Récupérer tous les statuts
export const getStatus = async (req, res) => {
    try {
        const status = await Status.find();
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Récupérer un statut par son ID
export const getStatusById = async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);
        if (!status) return res.status(404).json({ message: 'Statut non trouvé' });
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Créer un statut
export const createStatus = async (req, res) => {  
    try {
        const { status_name } = req.body;
        const { error } = statusValidationSchema({ status_name });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const newStatus = new Status({ status_name });
        await newStatus.save();
        res.status(201).json({
            message: 'Statut créé avec succès',
            status: newStatus
          });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur du serveur',
            error: error.message
          });
    }
}
