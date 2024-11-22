import Joi from 'joi';

// Schéma pour l'inscription
const registerSchema = Joi.object({

  name: Joi
    .string() // Le nom doit être une chaîne de caractères
    .min(3) // Minimum 3 caractères
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'string.base': '"name" doit être une chaîne de caractères',
      'string.min': '"name" doit contenir au moins 3 caractères',
      'any.required': '"name" est requis',
    }),

  email: Joi
    .string() // L'email doit être une chaîne de caractères
    .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}')) // Doit être une adresse email valide
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'string.base': '"email" doit être une chaîne de caractères',
      'string.email': '"email" doit être une adresse email valide',
      'any.required': '"email" est requis',
    }),

  password: Joi
    .string() // Le mot de passe doit être une chaîne de caractères
    .min(8) // Minimum 8 caractères
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // Doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'string.base': '"password" doit être une chaîne de caractères',
      'string.min': '"password" doit contenir au moins 8 caractères',
      'string.pattern.base': '"password" doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
      'any.required': '"password" est requis',
    }),

  confirmPassword: Joi
    .string() // Le mot de passe doit être une chaîne de caractères
    .valid(Joi.ref('password')) // Doit correspondre au mot de passe
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas', 
      'any.required': '"confirmPassword" est requis',
    }),

  role: Joi
    .string() // Le rôle doit être une chaîne de caractères
    .valid('user', 'admin') // Le rôle doit être soit "user" soit "admin"
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'any.only': 'Le rôle doit être "user" ou "admin"', // Si le rôle est invalide
      'any.required': '"role" est requis', // Si le rôle est manquant
    }),
});
// Schéma pour la connexion
const loginSchema = Joi.object({
  email: Joi
    .string() // L'email doit être une chaîne de caractères
    .email() // Doit être une adresse email valide
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'string.base': '"email" doit être une chaîne de caractères',
      'string.email': '"email" doit être une adresse email valide',
      'any.required': '"email" est requis',
    }),

  password: Joi
    .string() // Le mot de passe doit être une chaîne de caractères
    .min(8) // Minimum 8 caractères
    .required() // Champ requis
    .trim() // Supprime les espaces inutiles
    .messages({
      'string.base': '"password" doit être une chaîne de caractères',
      'string.min': '"password" doit contenir au moins 8 caractères',
      'any.required': '"password" est requis',
    }),
});

export { registerSchema, loginSchema };
