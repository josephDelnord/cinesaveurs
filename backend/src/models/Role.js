import mongoose from "mongoose";

// Modèle de données pour les rôles
const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: { unique: true },
    },
  },
  { timestamps: true }
);

// Indexation des champs
roleSchema.index({ role_name: 1 }, { unique: true });

const Role = mongoose.model("Role", roleSchema);
export default Role;
