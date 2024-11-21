import bcrypt from 'bcryptjs';
import generateJwtToken from '../middlewares/generateJwtToken.js';
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
  return res.status(500).json({ message: 'Une erreur est survenue, veuillez réessayer plus tard.' });
};

const createUserObject = async (name, email, password, roleName) => {
  // Trouver le rôle par son nom
  const role = await Role.findOne({ role_name: roleName });
  if (!role) {
    throw new Error('Rôle non trouvé');
  }
  return new User({ name, email, password, role: role._id });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Dans votre contrôleur d'inscription
export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return handleValidationError(res, error);

    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur avec le rôle
    const newUser = await createUserObject(name, email, hashedPassword, role);
    await newUser.save();

    // Générer le token
    const token = await generateJwtToken(newUser._id);

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès', 
      token 
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
};

// Dans votre contrôleur de connexion
export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return handleValidationError(res, error);

    const { email, password } = req.body;

    // Trouver l'utilisateur et peupler son rôle
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = await generateJwtToken(user._id);

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role.role_name 
      } 
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
};

export default {
  register,
  login
};