import Joi from "joi";

const addIngredientSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': '"name" doit être une chaîne de caractères',
        'any.required': '"name" est requis',
    }),

    quantity: Joi.number().required().messages({
        'number.base': '"quantity" doit être un nombre',
        'any.required': '"quantity" est requis',
    }),

    quantity_description: Joi.string().messages({
        'string.base': '"quantity_description" doit être une chaîne de caractères',
    }),

    unit: Joi.string().required().messages({
        'string.base': '"unit" doit être une chaîne de caractères',
        'any.required': '"unit" est requis',
    })
});

export default addIngredientSchema;
