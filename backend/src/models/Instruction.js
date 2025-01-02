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
  },
});

// Indexation des champs
instructionSchema.index({ step_number: 1 }); // Permet de retrouver rapidement les instructions par leur numéro d'étape
instructionSchema.index({ instruction: "text" }); // Indexation de type "text" pour la recherche de texte dans les instructions

const Instruction = mongoose.model("Instruction", instructionSchema);
export default Instruction;
