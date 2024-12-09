import Joi from 'joi';

// Schéma de validation pour le rôle
const roleValidationSchema = Joi.object({
    role_name: Joi
        .string() // Le nom du rôle est une chaîne de caractères
        .required() // champ requis                     
        .messages({
            'any.only': 'Le rôle doit être un des suivants : guest, user, admin',
            'any.required': 'Le rôle est obligatoire',
            'string.empty': 'Le rôle ne peut pas être vide',
        })
});

export default roleValidationSchema;
