// validators/commentValidator.js
import Joi from 'joi';

// Fonction de validation pour ajouter ou mettre à jour un commentaire
const validateCommentSchema = (data) => {
  const schema = Joi.object({
    content: Joi.string()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'Le contenu doit être une chaîne de caractères.',
        'string.empty': 'Le contenu ne peut pas être vide.',
        'string.min': 'Le contenu doit avoir au moins 1 caractère.',
        'string.max': 'Le contenu ne peut pas dépasser 1000 caractères.',
        'any.required': 'Le contenu est obligatoire.',
      }),

    recipeId: Joi.string().length(24).hex().required().messages({
      'string.hex': 'L\'ID de la recette doit être un identifiant valide.',
      'any.required': 'L\'ID de la recette est obligatoire.',
    }),

    userId: Joi.string().length(24).hex().required().messages({
      'string.hex': 'L\'ID de l\'utilisateur doit être un identifiant valide.',
      'any.required': 'L\'ID de l\'utilisateur est obligatoire.',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export default validateCommentSchema;