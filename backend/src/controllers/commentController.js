import Comment from "../models/Comment.js";

// Récupérer les commentaires de toutes les recettes
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving comments" });
  }
};
