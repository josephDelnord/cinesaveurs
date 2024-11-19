// src/__tests__/config/seed.test.js
import mongoose from 'mongoose';
import seedDatabase from '../../data/seed.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Role from '../../models/Role.js';
import User from '../../models/User.js';
import Recipe from '../../models/Recipe.js';

let mongoServer;

beforeAll(async () => {
  // Crée une instance de MongoDB en mémoire avec la version 8.0.3
  mongoServer = await MongoMemoryServer.create({
    instance: {
      version: '8.0.3', // Mise à jour de la version
    },
  });

  const mongoUri = mongoServer.getUri();

  // Vérifier que mongoUri est une chaîne avant de l'utiliser
  if (typeof mongoUri !== 'string') {
    throw new Error(`L'URI MongoDB n'est pas une chaîne, mais un ${typeof mongoUri}`);
  }

  // Connexion à MongoDB en mémoire avec options
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Déconnexion de la base de données et arrêt du serveur Mongo en mémoire
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('devrait insérer les données de manière correcte', async () => {
  await seedDatabase();  // Exécuter la fonction de seed

  // Vérifier l'insertion des rôles
  const roles = await Role.find();
  expect(roles).toHaveLength(3);  // Vérifier qu'il y a 3 rôles

  // Vérifier l'insertion des utilisateurs
  const users = await User.find();
  expect(users).toHaveLength(13);  // Vérifier qu'il y a 13 utilisateurs

  // Vérifier l'insertion des recettes
  const recipes = await Recipe.find();
  expect(recipes).toHaveLength(8);  // Vérifier qu'il y a 8 recettes
});
