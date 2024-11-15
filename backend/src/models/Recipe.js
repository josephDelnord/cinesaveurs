// models/Recipe.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  anecdocte: { 
    type: String 
  },
  ingredients: { 
    type: String, 
    required: true 
  },
  instructions: { 
    type: String, 
    required: true },
  source: { type: String 
  },
  date_added: { 
    type: Date, 
    default: Date.now 
  },
});

export default  mongoose.model('Recipe', recipeSchema);
