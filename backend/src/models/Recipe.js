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
  ingredients: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ingredient', 
    required: true 
  }],
  instructions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Instruction', 
    required: true 
  }],
  source: { 
    type: String 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  image: {
    type: String
  }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
