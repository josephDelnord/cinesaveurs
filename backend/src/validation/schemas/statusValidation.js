import Joi from 'joi';

// Schéma de validation pour le statut
const statusValidationSchema = Joi.object({
  status_name: Joi
    .string() // Le statut doit être une chaîne de caractères
    .required() // Le statut est obligatoire
    .messages({
      'string.empty': 'Le nom du statut ne peut pas être vide.',
      'any.required': 'Le nom du statut est requis.',
    }),
});

export default statusValidationSchema;
