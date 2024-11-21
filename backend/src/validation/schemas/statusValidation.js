import Joi from 'joi';
// Schéma de validation pour le statut
const statusValidationSchema = Joi.object({

  status_name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le nom du statut ne peut pas être vide.',
      'any.required': 'Le nom du statut est requis.',
    }),
});

// Fonction de validation
const validateStatus = (status) => {
  // abortEarly: false pour afficher toutes les erreurs rencontrées, pas seulement la première
  return statusValidationSchema.validate(status, { abortEarly: false });
};
export default validateStatus;
