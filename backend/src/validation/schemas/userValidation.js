// validation/userValidation.js
import Joi from 'joi';

// Schéma pour la mise à jour d'un utilisateur
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional().messages({
    'string.base': 'Le nom doit être une chaîne de caractères',
    'string.min': 'Le nom doit contenir au moins 3 caractères',
    'string.max': 'Le nom ne doit pas dépasser 50 caractères',
    'any.required': 'Le nom est requis',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': 'L\'email doit être une chaîne de caractères',
    'string.email': 'L\'email  doit être une adresse email valide',
    'any.required': 'L\'email  est requis',
  }),
  password: Joi.string().min(8).optional().messages({
    'string.base': 'Le mot de passe doit être une chaîne de caractères',
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'any.required': 'Le mot de passe est requis',
  }),
  newPassword: Joi.string().min(6).max(30).optional().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
    'any.required': '"confirmer le mot de passe" est requis',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).optional().messages({
    'any.only': 'Les mots de passe ne correspondent pas',
    'any.required': '"confirmer le mot de passe" est requis',
  }),
  status: Joi.string()
  .valid('actif', 'inactif')
  .optional() 

}).with('password', 'newPassword'); // s'assurter que l'ancien mot de passe est requis si un nouveau mot de passe est fourni

export default updateUserSchema;
