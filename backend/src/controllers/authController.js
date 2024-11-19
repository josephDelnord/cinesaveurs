import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import dotenv from 'dotenv';
import { registerSchema, loginSchema } from '../validation/schemas/authValidation.js';

dotenv.config();

const handleValidationError = (res, error) => {
  return res.status(400).json({ message: "Données invalides", errors: error.details });
};

const handleDatabaseError = (res, error) => {
  console.error('Erreur serveur:', error);
  return res.status(500).json({ message: 'Erreur serveur.' });
};

const createUserObject = (name, email, password, roleId) => {
  return new User({ name, email, password, role: roleId });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const generateJwtToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const register = async (req, res) => {
  console.log("Données reçues pour l'inscription:", req.body);

  // Validation des données d'inscription
  const { error } = registerSchema.validate(req.body);
  if (error) return handleValidationError(res, error);

  // Vérification du rôle
  const role = await Role.findOne({ role: req.body.role });
  if (!role) return res.status(400).json({ message: 'Rôle invalide.' });

  // Vérification de l'existence de l'utilisateur
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });

  try {
    // Hashage du mot de passe
    const hashedPassword = await hashPassword(req.body.password);

    // Création de l'utilisateur
    const newUser = createUserObject(req.body.name, req.body.email, hashedPassword, role._id);
    await newUser.save();

    console.log("Utilisateur enregistré avec succès");
    return res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation des données de connexion
  const { error } = loginSchema.validate({ email, password });
  if (error) return handleValidationError(res, error);

  try {
    // Recherche de l'utilisateur
    const user = await User.findOne({ email }).populate('role');
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect.' });

    // Génération du token JWT
    const token = generateJwtToken(user._id, user.role.role);

    // Retour de la réponse
    return res.status(200).json({
      message: 'Connexion réussie',
      user: {
        name: user.name,
        role: user.role.role,
        userId: user._id,
      },
      token: token,
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
};
