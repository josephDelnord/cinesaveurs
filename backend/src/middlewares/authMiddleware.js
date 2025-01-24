import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Middleware pour vérifier le token JWT
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // On récupère le token envoyé dans l'en-tête Authorization

  if (token == null) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    // Décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findById(decoded.userId).populate('role');

    if (!user || !user.role) {
      return res.status(403).json({ message: 'Utilisateur ou rôle invalide' });
    }

    // Ajouter les informations de l'utilisateur au requête
    req.userId = decoded.userId;
    req.userRole = user.role.role_name; // Stocke le nom du rôle de l'utilisateur (ex: 'admin', 'user')

    next(); // Continuer vers la route suivante
  } catch (error) {
    console.error('Erreur dans le middleware auth:', error);  // Ajouter un log pour plus de visibilité sur l'erreur
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

export default authMiddleware;
