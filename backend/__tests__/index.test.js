import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';  // L'application Express à partir de index.js

import { MongoMemoryServer } from 'mongodb-memory-server';
import Recipe from '../src/models/Recipe.js';
import { connectDB } from '../src/config/db.js';  // Connexion DB pour configurer avant chaque test

let mongod;  // Instance de MongoMemoryServer pour une base de données en mémoire
let recipeId;  // Variable pour stocker l'ID de recette

// Avant tous les tests, on prépare l'environnement en démarrant MongoMemoryServer
beforeAll(async () => {
  // Lancer MongoMemoryServer pour simuler une base de données en mémoire
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  process.env.MONGODB_URI = mongoUri;

  // Connexion à la base de données
  await connectDB();
});

// Après tous les tests, on nettoie l'environnement et on ferme la connexion à la base de données
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Test Fonctionnel de l\'API /api', () => {
  
  // Test de la route de base /api (simple route de test)
  test('GET /api should return welcome message', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, you are in the world of recipes!');
  });

  // Test de la création d'une recette via la route /api/recipes
  test('POST /api/recipes should create a new recipe', async () => {
    const recipeData = {
      title: 'Test Recipe',
      description: 'This is a test recipe.',
      ingredients: ['Test Ingredient 1', 'Test Ingredient 2'],
      steps: ['Step 1', 'Step 2']
    };

    // Faire une requête POST pour ajouter une recette
    const response = await request(app)
      .post('/api/recipes')
      .send(recipeData)
      .set('Content-Type', 'application/json');

    // Vérifier la réponse
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', recipeData.title);
    expect(response.body).toHaveProperty('description', recipeData.description);
    expect(response.body).toHaveProperty('ingredients');
    expect(response.body).toHaveProperty('steps');
    
    // Récupérer l'ID de la recette pour une future validation
    recipeId = response.body._id;
  });

  // Test de récupération de recette via l'ID
  test('GET /api/recipes/:id should return the recipe by ID', async () => {
    const response = await request(app).get(`/api/recipes/${recipeId}`);

    // Vérifier que la réponse contient la recette
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', recipeId);
    expect(response.body).toHaveProperty('title', 'Test Recipe');
  });

  // Test de mise à jour d'une recette
  test('PUT /api/recipes/:id should update the recipe', async () => {
    const updatedRecipe = {
      title: 'Updated Recipe',
      description: 'This is an updated test recipe.',
      ingredients: ['Updated Ingredient 1'],
      steps: ['Updated Step 1']
    };

    const response = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send(updatedRecipe)
      .set('Content-Type', 'application/json');

    // Vérifier la mise à jour
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', updatedRecipe.title);
    expect(response.body).toHaveProperty('description', updatedRecipe.description);
  });

  // Test de suppression d'une recette
  test('DELETE /api/recipes/:id should delete the recipe', async () => {
    const response = await request(app).delete(`/api/recipes/${recipeId}`);

    // Vérifier la suppression
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Recette supprimée avec succès.');

    // Vérifier que la recette n'existe plus dans la base de données
    const deletedRecipe = await Recipe.findById(recipeId);
    expect(deletedRecipe).toBeNull();
  });
});
