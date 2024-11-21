import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
    },
    quantity: {
        type: mongoose.Schema.Types.Mixed,
        min: 0,
    },
    quantity_description: { 
        type: String 
    },  // Champ supplémentaire pour les quantités comme "au goût"

    unit: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
    }
});
const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;