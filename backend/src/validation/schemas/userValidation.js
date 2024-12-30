// validation/userValidation.js
import Joi from "joi";

// Schéma pour la mise à jour d'un utilisateur
const updateUserSchema = Joi.object({
  name: Joi.string() // Le nom doit être une chaîne de caractères
    .min(3) // Le nom doit avoir au moins 3 caractères
    .required() // Le nom est requis
    .messages({
      "string.base": "Le nom doit être une chaîne de caractères",
      "string.min": "Le nom doit contenir au moins 3 caractères",
      "string.max": "Le nom ne doit pas dépasser 50 caractères",
      "any.required": "Le nom est requis",
    }),
  email: Joi.string() // L'email doit être une chaîne de caractères
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}/) // Doit être une adresse email valide
    .required() // L'email est requis
    .messages({
      "string.base": "L'email doit être une chaîne de caractères",
      "string.email": "L'email  doit être une adresse email valide",
      "any.required": "L'email  est requis",
    }),
  password: Joi.string() // Le mot de passe doit être une chaîne de caractères
    .min(8) // Le mot de passe doit avoir au moins 8 caractères
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/) // Doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial
    .required() // Le mot de passe est requis
    .messages({
      "string.base": "Le mot de passe doit être une chaîne de caractères",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères",
      "any.required": "Le mot de passe est requis",
    }),
  newPassword: Joi.string() // Le nouveau mot de passe doit être une chaîne de caractères
    .min(8) // Le nouveau mot de passe doit avoir au moins 8 caractères
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/) // Doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial
    .required() // Le nouveau mot de passe est requis
    .messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "any.required": '"confirmer le mot de passe" est requis',
    }),
  confirmPassword: Joi.string() // Le mot de passe de confirmation doit être une chaîne de caractères
    .valid(Joi.ref("newPassword")) // Le mot de passe de confirmation doit être identique au nouveau mot de passe
    .required() // Le mot de passe de confirmation est requis
    .messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "any.required": '"confirmer le mot de passe" est requis',
    }),
}).with("password", "newPassword"); // s'assurer que l'ancien mot de passe est requis si un nouveau mot de passe est fourni

export default updateUserSchema;
