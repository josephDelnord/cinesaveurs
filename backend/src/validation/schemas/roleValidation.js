import Joi from 'joi';

// Schéma de validation pour le rôle
const roleValidationSchema = Joi.object({
    role: Joi.string()
        .valid('guest', 'user', 'admin')  // On vérifie que le rôle est l'un de ces trois
        .required()                      
        .messages({
            'any.required': 'Le rôle est obligatoire',
            'string.empty': 'Le rôle ne peut pas être vide',
            'any.only': 'Le rôle doit être un des suivants : guest, user, admin',
        })
});

export default roleValidationSchema;
