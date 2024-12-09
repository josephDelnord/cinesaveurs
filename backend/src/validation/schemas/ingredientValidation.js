import Joi from "joi";

// Schéma pour la validation des ingrédients
const addIngredientSchema = Joi.object({
    name: Joi
    .string() // Le nom doit être une chaîne de caractères
    .required() // champ requis
    .messages({
        'string.base': '"name" doit être une chaîne de caractères',
        'any.required': '"name" est requis',
    }),

    quantity: Joi
    .number() // La quantité doit être un nombre
    .required() // champ requis
    .messages({
        'number.base': '"quantity" doit être un nombre',
        'any.required': '"quantity" est requis',
    }),

    quantity_description: Joi
    .string() // La quantité doit être une chaîne de caractères
    .messages({
        'string.base': '"quantity_description" doit être une chaîne de caractères',
    }),

    unit: Joi
    .string() // La quantité doit être une chaîne de caractères
    .required() // champ requis
    .messages({
        'string.base': '"unit" doit être une chaîne de caractères',
        'any.required': '"unit" est requis',
    })
});

export default addIngredientSchema;
