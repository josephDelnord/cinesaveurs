import Score from '../models/Score.js';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import scoreValidationSchema from '../validation/schemas/scoreValidation.js';

// Ajouter ou mettre à jour une note pour une recette
export const addOrUpdateScore = async (req, res) => {
  const { score, recipeId } = req.body;
  const userId = req.userId;

  try {
    // Validation avec Joi
    await scoreValidationSchema.validateAsync({ score, recipeId, userId });

    // Vérifier si la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Utiliser la méthode statique updateOrCreate pour gérer l'ajout ou la mise à jour du score
    const updatedScore = await Score.updateOrCreate(userId, recipeId, score);

    return res.status(updatedScore.isNew ? 201 : 200).json({
      message: updatedScore.isNew ? 'Score ajouté avec succès' : 'Score mis à jour avec succès',
      score: updatedScore,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(err => ({
          message: err.message,
          path: err.path,
        })),
      });
    }

    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la note' });
  }
};

// Récupérer les scores d'une recette
export const getScoresByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  console.log('Recipe ID:', recipeId);

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }

    const scores = await Score.find({ recipe: recipeId }).populate('user');
    if (scores.length === 0) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cette recette' });
    }

    const averageScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;

    return res.status(200).json({
      scores,
      averageScore: parseFloat(averageScore).toFixed(2),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des scores' });
  }
};

// Récupérer la note d'un utilisateur pour une recette spécifique
export const getScoreByUserAndRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.userId;  // L'ID de l'utilisateur authentifié
  console.log('Score ID:', recipeId);  // Vérifier si l'ID est correctement passé dans la requête

  try {
    const score = await Score.findByUserAndRecipe(userId, recipeId);
    if (!score) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cette recette' });
    }

    res.status(200).json(score);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la note' });
  }
};

// Supprimer un score
export const deleteScore = async (req, res) => {
  const { scoreId } = req.params;
  const userId = req.userId;  // Utilisateur authentifié

  try {
    const score = await Score.findById(scoreId);
    if (!score) {
      return res.status(404).json({ message: 'Score non trouvé' });
    }

    // Vérifier que l'utilisateur est bien celui qui a ajouté ce score, ou qu'il est un administrateur
    if (score.user.toString() !== userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce score' });
    }

    // Supprimer le score
    await score.remove();

    return res.status(200).json({ message: 'Score supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du score' });
  }
};
