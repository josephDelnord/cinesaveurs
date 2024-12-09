import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware pour générer un token JWT pour les utilisateurs authentifiés
const generateJwtToken = async (userId) => {
    // Récupérer l'utilisateur avec son rôle
    const user = await User.findById(userId).populate('role');
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
  
    return jwt.sign(
      { 
        userId, 
        role: user.role.role_name // Utiliser le nom du rôle
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  };

  export default generateJwtToken;