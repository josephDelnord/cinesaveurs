import Joi from 'joi';

// Schéma pour l'ajout d'une recette
const addRecipeSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        'string.base': '"title" doit être une chaîne de caractères',
        'string.min': '"title" doit contenir au moins 3 caractères',
        'any.required': '"title" est requis',
    }),
    description: Joi.string().min(10).required().messages({
        'string.base': '"description" doit être une chaîne de caractères',
        'string.min': '"description" doit contenir au moins 10 caractères',
        'any.required': '"description" est requis',
    }),
    anecdote: Joi.string().min(10).required().messages({
        'string.base': '"anecdote" doit être une chaîne de caractères',
        'string.min': '"anecdote" doit contenir au moins 10 caractères',
        'any.required': '"anecdote" est requis',
    }),
    ingredients: Joi.array().items(Joi.string().required()).min(1).required().messages({
        'array.base': '"ingredients" doit être un tableau',
        'array.min': '"ingredients" doit contenir au moins un ingrédient',
        'any.required': '"ingredients" est requis',
    }),
    instructions: Joi.array().items(Joi.string().required()).min(1).required().messages({
        'array.base': '"instructions" doit être un tableau',
        'string.min': '"instructions" doit contenir au moins 10 caractères',
        'any.required': '"instructions" est requis',
    }),
    source: Joi.string().uri().required().messages({
        'string.base': '"source" doit être une chaîne de caractères',
        'string.uri': '"source" doit être une URL valide',
        'any.required': '"source" est requis',
    }),
    date_added: Joi.date().default(Date.now).messages({
        'date.base': '"date_added" doit être une date valide',
    })
});

// Schéma pour la mise à jour d'une recette
const updateRecipeSchema = Joi.object({
    title: Joi.string().min(3).optional().messages({
        'string.base': '"title" doit être une chaîne de caractères',
        'string.min': '"title" doit contenir au moins 3 caractères',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.base': '"description" doit être une chaîne de caractères',
        'string.min': '"description" doit contenir au moins 10 caractères',
    }),
    anecdote: Joi.string().min(10).optional().messages({
        'string.base': '"anecdote" doit être une chaîne de caractères',
        'string.min': '"anecdote" doit contenir au moins 10 caractères',
    }),
    ingredients: Joi.array().items(Joi.string().required()).min(1).optional().messages({
        'array.base': '"ingredients" doit être un tableau',
        'array.min': '"ingredients" doit contenir au moins un ingrédient',
    }),
    instructions: Joi.string().min(10).optional().messages({
        'string.base': '"instructions" doit être une chaîne de caractères',
        'string.min': '"instructions" doit contenir au moins 10 caractères',
    }),
    source: Joi.string().uri().optional().messages({
        'string.base': '"source" doit être une chaîne de caractères',
        'string.uri': '"source" doit être une URL valide',
    }),
});

export { addRecipeSchema, updateRecipeSchema };
