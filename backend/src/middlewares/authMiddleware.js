import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Middleware pour vérifier le token JWT
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  // const token = req.cookies.auth_token; // Récupérer le token depuis les cookies

  if (token == null) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur existe et a un rôle valide
    const user = await User.findById(decoded.userId).populate('role');

    if (!user || !user.role) {
      return res.status(403).json({ message: 'Utilisateur ou rôle invalide' });
    }

    req.userId = decoded.userId;
    req.userRole = user.role.role_name; // Stocker le nom du rôle

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide ou expiré', error });
  }
};

export default authMiddleware;
