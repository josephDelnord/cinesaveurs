// models/Comment.js
import mongoose from "mongoose";

// Modèle de données pour les commentaires
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
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

// Indexation des champs
commentSchema.index({ user: 1 }); // Index pour rechercher les commentaires d'un utilisateur
commentSchema.index({ recipe: 1 }); // Index pour rechercher les commentaires d'une recette

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
