// src/types/Comment.ts

// Interface pour un Commentaire
export interface IComment {
  _id: string;            // Identifiant unique généré par Mongoose
  content: string;          // Contenu du commentaire (string)
  user: { username: string; _id: string; };       // Référence à l'utilisateur ayant posté le commentaire (ObjectId)
  recipe: { title: string; _id: string; };       // Référence à la recette associée au commentaire (ObjectId)
  createdAt: string;          // Date de création du commentaire
  updatedAt: string;          // Date de la dernière mise à jour du commentaire
  rating: number;            // Note associée au commentaire (1 à 5)

}

// Optionnel: Interface pour la création d'un commentaire (sans l'_id, createdAt, updatedAt)
export interface ICreateComment {
  content: string;
  user: { username: string; _id: string; };
  recipe: string;
  rating: number;
}