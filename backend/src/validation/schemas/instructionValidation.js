import Joi from "joi";

const addInstructionSchema = Joi.object({
    step_number: Joi.number().required().messages({
        'number.base': '"step_number" doit être un nombre',
        'any.required': '"step_number" est requis',
    }),
    instruction: Joi.string().required().messages({
        'string.base': '"instruction" doit être une chaîne de caractères',
        'any.required': '"instruction" est requis',
    })
});

export default addInstructionSchema;