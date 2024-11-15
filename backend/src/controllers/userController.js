// controllers/userController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { updateUserSchema } from '../validation/schemas/userValidation.js';

// Récupérer les informations d'un utilisateur
export const getUserInfo = async (req, res) => {
  const { id } = req.user; // Utilisateur connecté, id de l'utilisateur extrait du token JWT

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(id).select('-mot_de_passe'); // Ne pas retourner le mot de passe

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Retourner les informations de l'utilisateur
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier les informations d'un utilisateur (nom, email, mot de passe)
export const updateUserInfo = async (req, res) => {
  const { name, email, password, newPassword } = req.body;
  const { id } = req.user;

  // Validation des données avec Joi
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour les informations de l'utilisateur
    if (name) user.name = name;
    if (email) user.email = email;

    // Vérifier si un nouveau mot de passe est fourni
    if (newPassword) {
      // Comparer les mots de passe pour valider l'ancien mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'L\'ancien mot de passe est incorrect' });
      }

      // Hacher le nouveau mot de passe
      user.mot_de_passe = await bcrypt.hash(newPassword, 10);
    }

    // Sauvegarder les modifications
    await user.save();

    res.json({ message: 'Informations mises à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.user;

  try {
    // Trouver et supprimer l'utilisateur
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};