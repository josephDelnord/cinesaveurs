import mongoose from "mongoose";

// Modèle de données pour les instructions
const instructionSchema = new mongoose.Schema({
    step_number: {
        type: Number,
        required: true,
    },
    instruction: {
        type: String,
        required: true,
    }
});
const Instruction = mongoose.model('Instruction', instructionSchema);
export default Instruction;