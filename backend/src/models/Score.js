import mongoose from 'mongoose';

// Schéma de la note
const scoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
}, { timestamps: true });

// Créer un index composé unique pour éviter les doublons
scoreSchema.index({ user: 1, recipe: 1 }, { unique: true });

// Méthode statique : Trouver un score par utilisateur et recette
scoreSchema.statics.findByUserAndRecipe = function(userId, recipeId) {
  return this.findOne({ user: userId, recipe: recipeId });
};

// Méthode statique : Ajouter ou mettre à jour un score
scoreSchema.statics.updateOrCreate = function(userId, recipeId, score) {
  return this.findOneAndUpdate(
    { user: userId, recipe: recipeId },
    { score },
    { upsert: true, new: true }
  ).catch((error) => {
    // Gérer les erreurs de doublon spécifiques
    if (error.code === 11000) {
      throw new Error('Cet utilisateur a déjà noté cette recette.');
    }
    throw error; // Propagation des autres erreurs
  });
};

export default mongoose.model('Score', scoreSchema);
