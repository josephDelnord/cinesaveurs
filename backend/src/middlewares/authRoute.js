// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import  dotenv from 'dotenv';
dotenv.config();

const authRoute = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Le payload décodé (généralement l'ID de l'utilisateur) est attaché à req.user
    next();
  } catch (err) {
    console.error('Erreur de vérification du token:', err);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export default authRoute;
