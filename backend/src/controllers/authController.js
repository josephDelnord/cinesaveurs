import bcrypt from 'bcryptjs';
import generateJwtToken from '../middlewares/generateJwtToken.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Status from '../models/Status.js';
import dotenv from 'dotenv';
import { registerSchema, loginSchema } from '../validation/schemas/authValidation.js';
import { invalidateCache } from "../cache/memcached.js";

dotenv.config();

// Fonction pour gérer les erreurs de validation
const handleValidationError = (res, error) => {
  return res.status(400).json({ message: "Données invalides", errors: error.details });
};

// Fonction pour gérer les erreurs de base de données
const handleDatabaseError = (res, error) => {
  console.error('Erreur serveur:', error);
  return res.status(500).json({ message: 'Une erreur est survenue, veuillez réessayer plus tard.' });
};

// Fonction pour créer un objet utilisateur avec le rôle
const createUserObject = async (username, email, password, roleName) => {
  const role = await Role.findOne({ role_name: roleName });
  if (!role) {
    throw new Error('Rôle non trouvé');
  }
  return new User({ username, email, password, role: role._id });
};

// Fonction pour hacher le mot de passe
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);  // Utilisation du facteur de salage 10 pour le hachage
};

// Inscription d'un nouvel utilisateur
export const register = async (req, res) => {
  try {
    // Vérifier si un statut "active" existe dans la base de données
    let activeStatus = await Status.findOne({ status_name: "active" });
    if (!activeStatus) {
      // Si le statut n'existe pas, crée-le
      activeStatus = await Status.create({ status_name: "active" });
    }

    // Valider les données d'inscription
    const { error } = registerSchema.validate(req.body);
    if (error) return handleValidationError(res, error);

    // Récupérer les données du corps de la requête
    const { username, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur avec le rôle et le statut
    const newUser = await createUserObject(username, email, hashedPassword, role);
    newUser.status = activeStatus._id;  // Assigner l'ID du statut actif à l'utilisateur
    await newUser.save();

    // Générer le token JWT
    const token = await generateJwtToken(newUser._id);

    // Répondre avec le message de succès et le token
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token
    });
  } catch (error) {
    handleDatabaseError(res, error);
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    // Valider les données de connexion
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details);  // Log l'erreur de validation
      return handleValidationError(res, error);  // Validation des données
    }

    // Récupérer les données du corps de la requête
    const { email, password } = req.body;
    console.log('Tentative de connexion avec email:', email);  // Log l'email pour le suivi

    // Trouver l'utilisateur par son email et peupler son rôle
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      console.log('Utilisateur non trouvé pour l\'email:', email);  // Log si l'utilisateur n'est pas trouvé
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });  // Erreur 400 si l'utilisateur n'est pas trouvé
    }

    // Invalider le cache pour cette tentative de connexion
    invalidateCache(req); // Invalidation du cache de cette requête

    // Vérifier si l'utilisateur a le rôle "admin"
    if (user.role.role_name !== 'admin' && user.role.role_name !== 'user') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    console.log('Email reçu:', email);
    console.log("Mot de passe haché en base de données:", user.password);
    console.log("Mot de passe fourni pour la comparaison:", password);

    // Vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Mot de passe incorrect pour l\'utilisateur:', email);  // Log si le mot de passe ne correspond pas
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });  // Erreur 400 si le mot de passe est incorrect
    }

    // Générer le token
    const token = await generateJwtToken(user._id);
    if (!token) {
      console.log('Échec de la génération du token pour l\'utilisateur:', email);  // Log si la génération du token échoue
      return res.status(500).json({ message: 'Erreur lors de la génération du token' });  // Erreur 500 si la génération du token échoue
    }

    // Stocker le token dans un cookie HttpOnly pour la sécurité
    res.cookie('authToken', token, {
      httpOnly: true,  // Le cookie est accessible uniquement par le serveur
      secure: process.env.NODE_ENV === 'production',  // Le cookie est envoyé uniquement sur HTTPS en production
      maxAge: 60 * 60 * 1000, // Le cookie expire après 1 heure
      sameSite: 'Strict', // Empêche l'envoi du cookie sur des requêtes inter-domaines
    });

    // Retourner une réponse 200 avec le token et les informations de l'utilisateur
    console.log('Connexion réussie pour l\'utilisateur:', email);  // Log de succès
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.role_name
      }
    });
  } catch (error) {
    console.error('Erreur de base de données:', error);  // Log de l'erreur de base de données
    handleDatabaseError(res, error);  // Gestion des erreurs de base de données
  }
};

export default {
  register,
  login
};