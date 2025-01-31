import request from "supertest";
import app from "../../../index.js";
import { connectDB, disconnectDB } from "../../data/db.mjs";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Test de l\'API de recettes', () => {


  // Test de la route de base /api
  it('devrait répondre avec un message de bienvenue', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, you are in the world of recipes!');
  });

  // Test de la route GET /api/recipes
  it('devrait récupérer la liste des recettes', async () => {
    const response = await request(app).get('/api/recipes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
