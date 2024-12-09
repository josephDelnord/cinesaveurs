import Joi from 'joi';

// Schéma de validation pour le score
const scoreValidationSchema = Joi.object({
  score: Joi
    .number() // Le score est un nombre
    .integer() // Le score est un entier
    .min(1) // Le score est minimum 1
    .max(5) // Le score est maximum 5
    .required() // Le score est requis
    .messages({
      'number.base': 'La note doit être un nombre',
      'number.min': 'La note doit être un nombre entre 1 et 5',
      'number.max': 'La note doit être un nombre entre 1 et 5',
      'any.required': 'La note est requise',
    }),

  recipeId: Joi
    .string() // L'ID de la recette est une chaîne de caractères
    .pattern(/^[0-9a-fA-F]{24}$/) // Regex pour valider les ObjectIds MongoDB (24 caractères hexadécimaux)
    .required() // Le recipeId est requis
    .messages({ 
      'string.pattern.base': 'L\'ID de la recette est invalide. Il doit être un ObjectId MongoDB valide',
      'any.required': 'L\'ID de la recette est requis',
    }),

  userId: Joi
    .string() // L'ID de l'utilisateur est une chaîne de caractères
    .pattern(/^[0-9a-fA-F]{24}$/) // Regex pour valider les ObjectIds MongoDB (24 caractères hexadécimaux)
    .required() // Le userId est requis
    .messages({
      'string.pattern.base': 'L\'ID de l\'utilisateur est invalide. Il doit être un ObjectId MongoDB valide',
      'any.required': 'L\'ID de l\'utilisateur est requis',
    }),
});

export default scoreValidationSchema;
