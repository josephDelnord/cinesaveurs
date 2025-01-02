import mongoose from "mongoose";

// Modèle de données pour les ingrédients
const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  quantity: {
    type: mongoose.Schema.Types.Mixed,
    min: 0,
  },
  quantity_description: {
    type: String,
  }, // Champ supplémentaire pour les quantités comme "au goût"

  unit: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

// Indexation des champs
ingredientSchema.index({ name: 1 }); // Index sur le nom de l'ingrédient pour optimiser les recherches par nom
ingredientSchema.index({ unit: 1 }); // Index sur l'unité pour les recherches par unité (par exemple, grammes, cuillère)
ingredientSchema.index({ quantity: 1 }); // Index sur la quantité pour les recherches basées sur les quantités
ingredientSchema.index({ quantity_description: "text" }); // Indexation de type "text" pour une recherche de texte dans `quantity_description`

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
