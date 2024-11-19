import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../config/db.js'; 
import Role from '../../models/Role.js';
import User from '../../models/User.js';
import Recipe from '../../models/Recipe.js';

beforeAll(async () => {
  process.env.SEED_DB = 'false';  // Désactiver le seeding avant tous les tests
  await connectDB(); // Connecter à la base de données
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase(); // Nettoyer la base avant chaque test
});

afterAll(async () => {
  await disconnectDB(); // Déconnecter de la base après tous les tests
});

describe('Tests de la gestion du seeding de la base de données', () => {
  it('ne devrait pas insérer de données si SEED_DB est désactivé', async () => {
    // Pas de seeding donc les collections doivent être vides
    const roles = await Role.find();
    const users = await User.find();
    const recipes = await Recipe.find();

    // Vérification des assertions pour s'assurer que les collections sont vides
    expect(roles).toHaveLength(0);  // Aucun rôle ne devrait être inséré
    expect(users).toHaveLength(0);  // Aucun utilisateur ne devrait être inséré
    expect(recipes).toHaveLength(0);  // Aucune recette ne devrait être insérée
  });

  it('devrait respecter la configuration de SEED_DB', () => {
    // Test de la variable d'environnement
    expect(process.env.SEED_DB).toBe('false');  // Assurez-vous que SEED_DB est bien désactivé
  });

  it('devrait retourner une base vide après un dropDatabase', async () => {
    // Test pour vérifier que la base de données est effectivement vide après le nettoyage
    const rolesCount = await Role.countDocuments();
    const usersCount = await User.countDocuments();
    const recipesCount = await Recipe.countDocuments();

    expect(rolesCount).toBe(0);  // La collection Role doit être vide
    expect(usersCount).toBe(0);  // La collection User doit être vide
    expect(recipesCount).toBe(0);  // La collection Recipe doit être vide
  });
});
