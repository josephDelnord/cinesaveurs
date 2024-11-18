import Joi from 'joi';

// Fonction utilitaire pour générer des messages d'erreur
const errorMessage = (field, minLength = 0) => ({
  'string.base': `"${field}" doit être une chaîne de caractères`,
  'string.min': `"${field}" doit contenir au moins ${minLength} caractères`,
  'any.required': `"${field}" est requis`,
});

// Schéma pour l'inscription
const registerSchema = Joi.object({
  name: Joi.string()
  .min(3).required()
  .messages(errorMessage('name', 3)),
  
  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.base': '"email" doit être une chaîne de caractères',
    'string.email': '"email" doit être une adresse email valide',
    'any.required': '"email" est requis',
  }),
  password: Joi.string()
  .min(8)
  // .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
  .required()
  .messages(errorMessage('password', 8)),
  
  confirmPassword: Joi.string()
  .valid(Joi.ref('password'))
  .required().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
    'any.required': '"confirmPassword" est requis',
  }),
  
  role: Joi.string()
  .valid('user', 'admin')
  .required()
  .messages({
    'any.only': 'Le rôle doit être "user" ou "admin"',
    'any.required': '"role" est requis',
  }),
});

// Schéma pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': '"email" doit être une chaîne de caractères',
    'string.email': '"email" doit être une adresse email valide',
    'any.required': '"email" est requis',
  }),
  password: Joi.string().min(8).required().messages(errorMessage('password', 8)),
});

export { registerSchema, loginSchema };
