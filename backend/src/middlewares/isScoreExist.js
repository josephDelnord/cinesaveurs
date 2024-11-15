// Middleware pour vérifier si un score existe déjà pour cet utilisateur et cette recette
import Score from '../models/Score.js';

const isScoreExist = async function(next) {
    try {
    const existingScore = await Score.findOne({
        user: this.user,
        recipe: this.recipe
    });
      // Si un score existe déjà et qu'il s'agit d'une nouvelle note
    if (existingScore && this.isNew) {
        const error = new Error('Un score existe déjà pour cet utilisateur et cette recette');
        error.status = 400;
        return next(error);  // Passe l'erreur à Mongoose
    }
  
    next(); // Si tout est ok, continue avec la sauvegarde
    } catch (error) {
        next(error); // Si une erreur se produit lors de la vérification, la passe à Mongoose
    }
  };
export default isScoreExist;