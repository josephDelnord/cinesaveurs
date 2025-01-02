import mongoose from "mongoose";

// Modèle de données pour les catégories
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexation des champs
categorySchema.index({ name: 1 }); // Index sur `name` (ordre croissant)

const Category = mongoose.model("Category", categorySchema);
export default Category;
