import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import  dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Le payload décodé (généralement l'ID de l'utilisateur) est attaché à req.user
    req.user = decoded;  // Ajouter toute autre information du token, comme le rôle

     // Récupérer l'utilisateur et son rôle
     const user = await User.findById(req.userId).populate('role'); // Assurer que tu utilises le modèle Role correctement
     if (!user) {
       return res.status(404).json({ message: 'Utilisateur non trouvé' });
     }
     req.userRole = user.role.role; // Ajouter le rôle de l'utilisateur au `req`
     next(); // L'utilisateur est authentifié et le rôle est associé, continuer

  } catch (err) {
    console.error('Erreur de vérification du token:', err);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
  };

export default authMiddleware;
