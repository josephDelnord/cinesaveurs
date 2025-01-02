import mongoose from "mongoose";

// Modèle de données pour les scores
const scoreSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
  },
  { timestamps: true }
);

// Créer un index composé unique pour éviter les doublons
scoreSchema.index({ user: 1, recipe: 1 }, { unique: true });
// Optionnel : index sur `score` pour accélérer les recherches basées sur les scores
scoreSchema.index({ score: 1 });

// // Méthode statique : Trouver un score par utilisateur et recette
// scoreSchema.statics.findByUserAndRecipe = function (user, recipe) {
//   return this.findOne({ user: user, recipe: recipe });
// };

// // Méthode statique : Ajouter ou mettre à jour un score
// scoreSchema.statics.updateOrCreate = function (user, recipe, score) {
//   return this.findOneAndUpdate(
//     { user: user, recipe: recipe },
//     { score },
//     { upsert: true, new: true }
//   ).catch((error) => {
//     // Gérer les erreurs de doublon spécifiques
//     if (error.code === 11000) {
//       throw new Error("Cet utilisateur a déjà noté cette recette.");
//     }
//     throw error; // Propagation des autres erreurs
//   });
// };

const Score = mongoose.model("Score", scoreSchema);
export default Score;
