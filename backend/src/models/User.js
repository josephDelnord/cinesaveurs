import mongoose from "mongoose";

// Modèle de données pour les utilisateurs
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: false, // Ne pas marquer comme requis ici
      select: false, // Cela empêche confirmPassword d'être sauvegardé dans la BDD
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexation des champs
userSchema.index({ username: 1 }); // Index pour les recherches rapides sur username
// Index sur status et role pour optimiser les jointures/populations
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
