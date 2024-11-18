import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';
import validateCommentSchema from '../validation/schemas/commentValidation.js';

// Ajouter un commentaire
export const addComment = async (req, res) => {
  const { content, recipeId } = req.body;
  const userId = req.userId;  // Si tu utilises un middleware pour l'authentification

  // Validation des données
  const { error } = validateCommentSchema({ content, recipeId, userId });
  if (error) {
    return res.status(400).json({ message: error.details.map(x => x.message).join(', ') });
  }

  try {
    // Vérifier si la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }

    // Créer un nouveau commentaire
    const newComment = new Comment({
      content,
      user: userId,
      recipe: recipeId,
    });

    // Sauvegarder le commentaire
    await newComment.save();

    return res.status(201).json({ message: 'Commentaire ajouté avec succès', comment: newComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du commentaire' });
  }
};

// Récupérer les commentaires d'une recette
export const getCommentsByRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    // Chercher tous les commentaires associés à la recette
    const comments = await Comment.find({ recipe: recipeId }).populate('user', 'name').populate('recipe', 'title');

    if (comments.length === 0) {
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour cette recette' });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des commentaires' });
  }
};

// Mettre à jour un commentaire
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.userId;  // ID de l'utilisateur connecté

  // Validation des données
  const { error } = validateCommentSchema({ content, recipeId: req.body.recipeId, userId });
  if (error) {
    return res.status(400).json({ message: error.details.map(x => x.message).join(', ') });
  }

  try {
    // Vérifier si le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Vérifier que l'utilisateur est bien celui qui a créé le commentaire
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce commentaire' });
    }

    // Mettre à jour le commentaire
    comment.content = content;
    await comment.save();

    return res.status(200).json({ message: 'Commentaire mis à jour avec succès', comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du commentaire' });
  }
};

// Supprimer un commentaire
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;  // ID de l'utilisateur connecté

  try {
    // Vérifier si le commentaire existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Vérifier que l'utilisateur est bien celui qui a créé le commentaire
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
    }

    // Supprimer le commentaire
    await comment.remove();

    return res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du commentaire' });
  }
};
