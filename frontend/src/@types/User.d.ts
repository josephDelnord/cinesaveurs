// src/types/User.ts

// Interface pour un Utilisateur
export interface IUser {
  name: ReactNode;
  _id: string;              // Identifiant unique généré par Mongoose
  username: string;           // Nom d'utilisateur
  email: string;              // Email de l'utilisateur (doit être unique)
  password: string;           // Mot de passe de l'utilisateur
  confirmPassword?: string;   // Confirmer le mot de passe (ne fait pas partie de la base de données)
  status: { status_name: string; };          // Référence au statut de l'utilisateur (si applicable)
  role: { role_name: string; };             // Référence au rôle de l'utilisateur
  createdAt: string;            // Date de création de l'utilisateur
  updatedAt: string;            // Date de la dernière mise à jour
}

// Interface pour la création d'un utilisateur (sans l'_id, createdAt, updatedAt)
export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;   // Ne pas inclure `confirmPassword` dans la base de données
  status: { status_name: string; };          // Référence au statut de l'utilisateur (si applicable)
  role: { role_name: string; };             // Référence au rôle de l'utilisateur
}

// Interface pour un Rôle
export interface IRole {
  _id: string;            // Identifiant unique généré par Mongoose
  role_name: string;        // Nom du rôle (string)
  createdAt: string;          // Date de création du rôle
  updatedAt: string;          // Date de la dernière mise à jour du rôle
}

// Interface pour la création d'un rôle (sans l'_id, createdAt, updatedAt)
export interface ICreateRole {
  role_name: string;        // Nom du rôle (string)
}

// Interface pour un Status
export interface IStatus {
  _id: string;           // Identifiant unique généré par Mongoose
  status_name: string;     // Nom du statut (obligatoire)
  createdAt: string;         // Date de création du statut
  updatedAt: string;         // Date de la dernière mise à jour du statut
}

// Interface pour la création d'un statut (sans l'_id, createdAt, updatedAt)
export interface ICreateStatus {
  status_name: string;     // Nom du statut
}