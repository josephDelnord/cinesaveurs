import mongoose from "mongoose";

// Modèle de données pour les statuts
const statusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexation des champs
statusSchema.index({ status_name: 1 }); // Index pour rechercher les statuts par nom

const Status = mongoose.model("Status", statusSchema);
export default Status;
