import mongoose from 'mongoose';
import { getAllCategories } from '../../controllers/categoryController.js';
import Category from '../../models/Category.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('../../validation/schemas/categoryValidation.js', () => ({
  validate: jest.fn().mockReturnValue({
    error: null, // Pas d'erreur de validation
  }),
}));

describe('Category Controller with MongoMemoryServer', () => {
  let res;
  let req;
  let mongoServer;

  beforeAll(async () => {
    // Désactiver les messages d'erreur de la console
    console.error = jest.fn(); 
    // Démarrer MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connecter Mongoose à la base de données Mongo en mémoire
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  beforeEach(() => {
    // Préparer la réponse (res) et la requête (req) pour chaque test
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    req = {
      body: { name: 'Test Category' },
      params: { id: '123' },
    };
  });

  afterEach(async () => {
    // Nettoyer la base de données après chaque test
    await Category.deleteMany({});
  });

  afterAll(async () => {
    // Fermer la connexion et arrêter MongoMemoryServer après les tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('getAllCategories', () => {
    it('should handle errors if there is a database issue', async () => {
      // Simuler une erreur dans le modèle Category.find
      jest.spyOn(Category, 'find').mockRejectedValue(new Error('Database error'));

      await getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la récupération des catégories',
        error: expect.any(Error),
      });
    });

    it('should return categories successfully', async () => {
      // Créer une catégorie pour le test
      const category = new Category({ name: 'Test Category' });
      await category.save();

      // Vérifier que Category.find() renvoie bien la catégorie créée
      jest.spyOn(Category, 'find').mockResolvedValue([category]);

      await getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([category]);
    });
  });

});
