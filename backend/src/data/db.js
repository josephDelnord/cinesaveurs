import mongoose from "mongoose";
import dotenv from "dotenv";
import seedDatabase from "./seed.js";  // Importer le script de seeding

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.LOCAL_URI || process.env.ATLAS_URI;

    if (!mongoURI) {
      throw new Error("Variable d'environnement non définie");
    }

    // Connexion à MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connecté à MongoDB");

    // Log de débogage
    mongoose.connection.on("connected", () => {
      console.log("Connexion réussie à MongoDB Atlas !");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Erreur de connexion MongoDB : ", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Connexion MongoDB déconnectée.");
    });

    // Lancer le seeding si nécessaire
    console.log("Valeur de SEED_DB:", process.env.SEED_DB);
    if (process.env.NODE_ENV !== "test" && process.env.SEED_DB === "true") {
      console.log("Démarrage du seeding...");
      await seedDatabase();
    } else {
      console.log("Seeding désactivé ou en mode test");
    }

  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    console.error(
      "URI de connexion utilisé:",
      process.env.LOCAL_URI || process.env.ATLAS_URI
    );

    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      console.error("Erreur de connexion à MongoDB, tests échoués.");
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Déconnecté de MongoDB");
  } catch (error) {
    console.error("Erreur de déconnexion de MongoDB:", error);
  }
};

export default connectDB;
