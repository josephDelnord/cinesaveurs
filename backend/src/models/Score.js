// models/Note.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
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

export default mongoose.model('Score', noteSchema);
