// validation/userValidation.js
import Joi from 'joi';

// Validation pour la mise à jour des informations utilisateur
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional().messages({
    'string.base': '"name" doit être une chaîne de caractères',
    'string.min': '"name" doit contenir au moins 3 caractères',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': '"email" doit être une chaîne de caractères',
    'string.email': '"email" doit être une adresse email valide',
  }),
  password: Joi.string().min(8).optional().messages({
    'string.base': '"password" doit être une chaîne de caractères',
    'string.min': '"password" doit contenir au moins 8 caractères',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).optional().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
  }),
  newPassword: Joi.string().min(8).optional().messages({
    'string.base': '"newPassword" doit être une chaîne de caractères',
    'string.min': '"newPassword" doit contenir au moins 8 caractères',
  }),
}).with('password', 'nnewPassword'); // s'assurter que l'ancien mot de passe est requis si un nouveau mot de passe est fourni

export { updateUserSchema };
