import Joi from 'joi';

// Schéma de validation pour le score
const scoreValidationSchema = Joi.object({
  score: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'La note doit être un nombre',
      'number.min': 'La note doit être un nombre entre 1 et 5',
      'number.max': 'La note doit être un nombre entre 1 et 5',
      'any.required': 'La note est requise',
    }),

  recipeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Regex pour valider les ObjectIds MongoDB
    .required()
    .messages({
      'string.pattern.base': 'L\'ID de la recette est invalide. Il doit être un ObjectId MongoDB valide',
      'any.required': 'L\'ID de la recette est requis',
    }),

  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Regex pour valider les ObjectIds MongoDB
    .required()
    .messages({
      'string.pattern.base': 'L\'ID de l\'utilisateur est invalide. Il doit être un ObjectId MongoDB valide',
      'any.required': 'L\'ID de l\'utilisateur est requis',
    }),
});

export default scoreValidationSchema;
