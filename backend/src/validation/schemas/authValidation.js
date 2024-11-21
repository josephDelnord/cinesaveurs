import Joi from 'joi';

// Fonction utilitaire pour générer des messages d'erreur
const errorMessage = (field, minLength = 0) => ({
  'string.base': `"${field}" doit être une chaîne de caractères`,
  'string.min': `"${field}" doit contenir au moins ${minLength} caractères`,
  'any.required': `"${field}" est requis`,
});

// Schéma pour l'inscription
const registerSchema = Joi.object({
  // Validation du nom
  name: Joi.string()
    .min(3) // Minimum 3 caractères
    .required() // Champ requis
    .messages(errorMessage('name', 3)),

  // Validation de l'email
  email: Joi.string()
    .email() // Doit être une adresse email valide
    .required() // Champ requis
    .messages({
      'string.base': '"email" doit être une chaîne de caractères',
      'string.email': '"email" doit être une adresse email valide',
      'any.required': '"email" est requis',
    }),

  // Validation du mot de passe
  password: Joi.string()
    .min(8) // Minimum 8 caractères
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // Doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial
    .required() // Champ requis
    .messages(errorMessage('password', 8)),

  // Validation de la confirmation du mot de passe
  confirmPassword: Joi.string()
    .valid(Joi.ref('password')) // Doit correspondre au mot de passe
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas', // Si les mots de passe ne correspondent pas
      'any.required': '"confirmPassword" est requis', // Si le champ est manquant
    }),

  // Validation du rôle
  role: Joi.string()
    .valid('user', 'admin') // Le rôle doit être soit "user" soit "admin"
    .required() // Champ requis
    .messages({
      'any.only': 'Le rôle doit être "user" ou "admin"', // Si le rôle est invalide
      'any.required': '"role" est requis', // Si le rôle est manquant
    }),
});

// Schéma pour la connexion
const loginSchema = Joi.object({
  // Validation de l'email pour la connexion
  email: Joi.string()
    .email() // Doit être une adresse email valide
    .required() // Champ requis
    .messages({
      'string.base': '"email" doit être une chaîne de caractères',
      'string.email': '"email" doit être une adresse email valide',
      'any.required': '"email" est requis',
    }),

  // Validation du mot de passe pour la connexion
  password: Joi.string()
    .min(8) // Minimum 8 caractères
    .required() // Champ requis
    .messages(errorMessage('password', 8)),
});

export { registerSchema, loginSchema };
