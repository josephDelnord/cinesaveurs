import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware pour générer un token JWT pour les utilisateurs authentifiés
const generateJwtToken = async (userId) => {
  try {
    // Récupérer l'utilisateur avec son rôle
    const user = await User.findById(userId).populate('role');
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si le rôle de l'utilisateur est défini
    if (!user.role || !user.role.role_name) {
      throw new Error('Rôle de l\'utilisateur non défini');
    }

    // Créer et signer le token JWT
    const token = jwt.sign(
      {
        userId,
        role: user.role.role_name // Utiliser le nom du rôle
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  } catch (error) {
    console.error('Erreur lors de la génération du JWT:', error.message);
    throw error;  // Relancer l'erreur pour que l'appelant puisse la gérer
  }
};

export default generateJwtToken;
