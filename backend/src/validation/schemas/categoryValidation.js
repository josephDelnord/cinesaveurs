import Joi from 'joi';

// Schéma pour la validation d'une catégorie
const categoryValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)  // imposer une longueur minimale, 3 caractères
        .required() 
        .messages({
            'string.base': 'Le nom de la catégorie doit être une chaîne de caractères',
            'string.empty': 'Le nom de la catégorie ne peut pas être vide',
            'string.min': 'Le nom de la catégorie doit comporter au moins 3 caractères',
            'any.required': 'Le nom de la catégorie est requis',
        })
});

export default categoryValidationSchema;
