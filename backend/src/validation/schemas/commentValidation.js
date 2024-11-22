// validators/commentValidator.js
import Joi from 'joi';

// Schéma pour la validation des commentaires
const validateCommentSchema = (data) => {
  const schema = Joi.object({
    content: Joi
      .string() // Le contenu doit être une chaîne de caractères
      .min(1) // Le contenu doit avoir au moins 1 caractère
      .max(1000) // Le contenu ne peut pas dépasser 1000 caractères
      .required() // champ requis
      .messages({
        'string.base': 'Le contenu doit être une chaîne de caractères.',
        'string.empty': 'Le contenu ne peut pas être vide.',
        'string.min': 'Le contenu doit avoir au moins 1 caractère.',
        'string.max': 'Le contenu ne peut pas dépasser 1000 caractères.',
        'any.required': 'Le contenu est obligatoire.',
      }),

    recipeId: Joi
    .string() // Le recipeId doit être une chaîne de caractères
    .pattern(/^[0-9a-fA-F]{24}$/) // Regex pour valider les ObjectIds MongoDB (24 caractères hexadécimaux)
    .required() // champ requis
    .messages({
      'string.hex': 'L\'ID de la recette doit être un identifiant valide.',
      'any.required': 'L\'ID de la recette est obligatoire.',
    }),

    userId: Joi
    .string() // L'userId doit être une chaîne de caractères
    .pattern(/^[0-9a-fA-F]{24}$/) // Regex pour valider les ObjectIds MongoDB (24 caractères hexadécimaux)
    .required() // champ requis
    .messages({
      'string.hex': 'L\'ID de l\'utilisateur doit être un identifiant valide.',
      'any.required': 'L\'ID de l\'utilisateur est obligatoire.',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export default validateCommentSchema;