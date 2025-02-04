import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    anecdote: {
      type: String,
      default: "Aucune anecdote"
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
    ],
    instructions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instruction",
        required: true,
      },
    ],
    source: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
      default: "Aucune image"
    },
  },
  { timestamps: true }
);

// Indexation des champs
recipeSchema.index({ category: 1 }); // Index pour les recherches rapides sur la catégorie
// Index sur `ingredients` et `instructions` pour améliorer les performances des jointures (populate)
recipeSchema.index({ ingredients: 1 });
recipeSchema.index({ instructions: 1 });

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
