// src/types/Score.ts

// Interface pour un Score
export interface IScore {
  _id: string;            // Identifiant unique généré par Mongoose
  score: number;            // Le score donné, un nombre entre 1 et 5
  user: { username: string; _id: string; };       // Référence à l'utilisateur qui a attribué le score (ObjectId)
  recipe: { title: string; _id: string; };   // Référence à la recette à laquelle ce score est attribué (ObjectId)
  createdAt: string;          // Date de création du score
  updatedAt: string;          // Date de la dernière mise à jour du score
}

// Optionnel : Interface pour la création d'un score (sans l'_id, createdAt, updatedAt)
export interface ICreateScore {
  score: number;            // Le score attribué à la recette (nombre entre 1 et 5)
  user: { username: string; };       
  recipe: {_id: string }         // L'ID de la recette pour laquelle le score est attribué
}
