// models/Comment.js
import mongoose from 'mongoose';

// Modèle de données pour les commentaires
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
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

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
