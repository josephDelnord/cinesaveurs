import Joi from "joi";

// Schéma pour la validation des instructions
const addInstructionSchema = Joi.object({
    step_number: Joi
    .number() // Le numéro de l'étape
    .required() // champ requis
    .messages({
        'number.base': '"step_number" doit être un nombre',
        'any.required': '"step_number" est requis',
    }),
    instruction: Joi
    .string() // La description de l'étape
    .required() // champ requis
    .messages({
        'string.base': '"instruction" doit être une chaîne de caractères',
        'any.required': '"instruction" est requis',
    })
});

export default addInstructionSchema;