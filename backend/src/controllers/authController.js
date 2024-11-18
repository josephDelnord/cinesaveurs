import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import dotenv from 'dotenv';
import { registerSchema, loginSchema } from '../validation/schemas/authValidation.js';

dotenv.config();

// Inscription d'un utilisateur ou d'un administrateur
export const register = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  console.log("Données reçues pour l'inscription:", { name, email, password, confirmPassword, role });

  // Validation des données d'inscription avec Joi
  const { error } = registerSchema.validate({ name, email, password, confirmPassword, role });
  if (error) {
    console.log("Erreur de validation:", error.details);
    return res.status(400).json({ message: 'Données invalides', errors: error.details });
  }

  // Vérification que les mots de passe correspondent
  if (password !== confirmPassword) {
    console.log("Les mots de passe ne correspondent pas");
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    console.log("Utilisateur trouvé dans la base de données:", userExists);
    
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Déterminer le rôle
    let userRole;
    if (!role) {
      // Si aucun rôle n'est spécifié, on assigne par défaut le rôle 'user'
      userRole = await Role.findOne({ role: 'user' });
      console.log("Rôle par défaut assigné (user):", userRole);
    } else {
      // Si un rôle est spécifié, on l'assigne
      userRole = await Role.findOne({ role });
      console.log("Rôle spécifié trouvé:", userRole);
      if (!userRole) {
        console.log("Rôle invalide spécifié");
        return res.status(400).json({ message: 'Rôle invalide.' });
      }
    }

    // Créer l'utilisateur (ne pas inclure confirmPassword)
    const newUser = new User({
      name,
      email,
      password,  // Ici, tu n'inclus pas confirmPassword
      confirmPassword,  // Juste pour la validation avant hachage
      role: userRole._id,
    });

    console.log("Création de l'utilisateur:", newUser);

    await newUser.save();

    console.log("Utilisateur enregistré avec succès");
    return res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
};

// Connexion d'un utilisateur ou d'un administrateur
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation des données de connexion avec Joi
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    console.log('Validation error:', error.details); // Affiche les erreurs de validation si présentes
    return res.status(400).json({ message: 'Données invalides', errors: error.details });
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      console.log(`Utilisateur avec l'email ${email} non trouvé.`);
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }
    console.log('Utilisateur trouvé:', user); // Affiche l'utilisateur trouvé dans la base de données

    // Comparer le mot de passe en clair avec le mot de passe haché
    const isMatch = await bcrypt.compare(password, user.password);  // Mot de passe en clair (password) vs mot de passe haché (user.password)
    
    console.log('Mot de passe en clair entré:', password); // Affiche le mot de passe en clair entré par l'utilisateur
    console.log('Mot de passe en base de données:', user.password); // Affiche le mot de passe haché récupéré en base

    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    console.log('Mot de passe vérifié avec succès');

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token valide pendant 1 heure
    );

    console.log('Token JWT généré:', token); // Affiche le token généré

    // Retourner la réponse avec le message, nom, rôle, ID et token
    return res.status(200).json({
      message: 'Connexion réussie',
      user: {
        name: user.name,
        role: user.role.role,
        userId: user._id,
      },
      token: token, // Token JWT
    });

  } catch (error) {
    console.error('Erreur serveur lors de la connexion:', error); // Affiche l'erreur serveur
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};