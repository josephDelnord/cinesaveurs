import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import updateUserSchema from '../validation/schemas/userValidation.js';  // Assurez-vous que ce schéma de validation est défini

// Récupérer les informations d'un utilisateur
export const getUserInfo = async (req, res) => {
  const userId = req.params.userId;  // L'ID de l'utilisateur passé dans l'URL
  const loggedInUserId = req.userId;  // L'ID de l'utilisateur authentifié (présent dans le token JWT)

  try {
    // Vérifier si l'utilisateur connecté est un administrateur (ou l'utilisateur connecté lui-même)
    if (userId !== loggedInUserId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit. Vous ne pouvez accéder qu\'à vos propres informations.' });
    }

    // Récupérer l'utilisateur demandé
    const user = await User.findById(userId)
    .select('-password') // Ne pas retourner le mot de passe
    .populate('status') // Populate le statut et ne récupérer que le nom du statut
    .populate('role'); // Populate le rôle et ne récupérer que le nom du rôle

    console.log('Utilisateur récupéré :', user);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Retourner les informations de l'utilisateur
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status ? user.status.status_name : 'Non défini', // Affichage du nom du statut
      role: user.role ? user.role.role_name : 'Non défini',           // Affichage du nom du rôle
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des informations de l\'utilisateur.' });
  }
};

// Mettre à jour les informations d'un utilisateur
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, newPassword, confirmPassword, status } = req.body;

  // Valider les données avec Joi
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Données invalides', errors: error.details });
  }

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour des informations (par exemple, le nom)
    if (name) user.name = name;
    if (email) user.email = email;
    if (status) user.status = status; // Assurez-vous que status est un champ valide

    // Si un nouveau mot de passe est fourni, vérifier et mettre à jour
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas.' });
      }

      user.password = await bcrypt.hash(newPassword, 10); // Hachage du nouveau mot de passe
    }

    // Sauvegarder les modifications
    await user.save();
      // Retourner les nouvelles informations de l'utilisateur
      return res.status(200).json({
        message: 'Utilisateur mis à jour avec succès.',
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur.' });
  }
};

// Supprimer un utilisateur (accessible uniquement par un administrateur)
export const deleteUser = async (req, res) => {
  const userId = req.params.userId; // ID de l'utilisateur à supprimer

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Supprimer l'utilisateur
    await user.remove();
    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer tous les utilisateurs (accessible uniquement par un administrateur)
export const getAllUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await User.find().select('-password'); // Ne pas retourner les mots de passe des utilisateurs

    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// vérifier le statut de l'utilisateur
export const checkUserStatus = async (req, res) => { 
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    console.error('Erreur lors de la vérification du statut de l\'utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
  };

  // Suspender un utilisateur (accessible uniquement par un administrateur)

  export const suspendUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Mettre à jour le statut de l'utilisateur à "suspendu"
      user.status = 'suspendu';
      await user.save();
      return res.status(200).json({ message: 'Utilisateur suspendu avec succès' });
      } catch (err) {
        console.error('Erreur lors de la suspension de l\'utilisateur:', err);
        res.status(500).json({ message: 'Erreur serveur' });
      }
      };
  
  // Activer un utilisateur (accessible uniquement par un administrateur)
  export const activateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      // Mettre à jour le statut de l'utilisateur à "actif"
      user.status = 'actif';
      await user.save();
      return res.status(200).json({ message: 'Utilisateur activé avec succès' });
      } catch (err) {
      console.error('Erreur lors de l\'activation de l\'utilisateur:', err);
      res.status(500).json({ message: 'Erreur serveur' });
      }
      };
    