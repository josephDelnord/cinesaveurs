// models/Recipe.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true
  },
  description: { 
    type: String, 
    required: true 
  },
  anecdote: { 
    type: String 
  },
  ingredients: { 
    type: [String], 
    required: true 
  },
  instructions: { 
    type: [String], 
    required: true 
  },
  source: { 
    type: String 
  },
}, { timestamps: true });

export default  mongoose.model('Recipe', recipeSchema);
