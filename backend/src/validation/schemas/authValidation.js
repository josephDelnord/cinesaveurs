import Joi from 'joi';

// Schéma pour l'inscription
const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': '"name" doit être une chaîne de caractères',
    'string.min': '"name" doit contenir au moins 3 caractères',
    'any.required': '"name" est requis',
  }),
  email: Joi.string().email().required().messages({
    'string.base': '"email" doit être une chaîne de caractères',
    'string.email': '"email" doit être une adresse email valide',
    'any.required': '"email" est requis',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': '"password" doit être une chaîne de caractères',
    'string.min': '"password" doit contenir au moins 8 caractères',
    'any.required': '"password" est requis',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
    'any.required': '"confirmPassword" est requis',
  })
});

// Schéma pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': '"email" doit être une chaîne de caractères',
    'string.email': '"email" doit être une adresse email valide',
    'any.required': '"email" est requis',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': '"password" doit être une chaîne de caractères',
    'string.min': '"password" doit contenir au moins 8 caractères',
    'any.required': '"password" est requis',
  }),
});

export { registerSchema, loginSchema };
