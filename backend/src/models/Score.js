// models/Note.js
import mongoose from 'mongoose';
import isScoreExist from '../middlewares/isScoreExist.js';

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
});

// Créer un index composé unique
scoreSchema.index({ user: 1, recipe: 1 }, { unique: true });

// OU alternativement, créer un champ composite unique
scoreSchema.virtual('composite_id').get(function () {
  return `${this.user}_${this.recipe}`;
});

// Appliquer le middleware isScore avant la sauvegarde
scoreSchema.pre('save', isScoreExist);

// Méthodes statiques utiles
scoreSchema.statics.findByUserAndRecipe = function(userId, recipeId) {
  return this.findOne({ user: userId, recipe: recipeId });
};

scoreSchema.statics.updateOrCreate = async function(userId, recipeId, score) {
  return this.findOneAndUpdate(
      { user: userId, recipe: recipeId },
      { score: score },
      { upsert: true, new: true }
  );
};

export default mongoose.model('Score', scoreSchema);
