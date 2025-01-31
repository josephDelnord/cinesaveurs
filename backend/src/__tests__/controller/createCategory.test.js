import { createCategory } from '../../controllers/categoryController.js';
import Category from '../../models/Category.js';
import { invalidateCache } from '../../cache/memcached.js';

jest.setTimeout(60000); // Définit un timeout de 60 secondes

// Moker les fonctions de modèle et de cache
jest.mock('../../models/Category.js');
jest.mock('../../cache/memcached.js');

// Tests
describe('createCategory Controller', () => {
  let req;
  let res;

  // Reset les mocks avant chaque test
  beforeEach(() => {
    req = {
      body: {
        name: 'Test Category'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // Test pour une requête valide
  test('should create a new category successfully', async () => {
    const mockCategory = { name: 'Test Category', _id: '123' };
    Category.findOne.mockResolvedValue(null);
    Category.prototype.save.mockResolvedValue(mockCategory);

    await createCategory(req, res);

    expect(Category.findOne).toHaveBeenCalledWith({ name: 'Test Category' });
    expect(invalidateCache).toHaveBeenCalledWith('GET:/api/categories');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  // Tests pour les cas d'erreurs
  test('should return 400 if category already exists', async () => {
    Category.findOne.mockResolvedValue({ name: 'Test Category' });

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cette catégorie existe déjà' });
  });

  // Test pour une requête invalide
  test('should return 400 for invalid category data', async () => {
    req.body = {};

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.any(String)
    }));
  });

  // Test pour les erreurs de base de données
  test('should handle database errors', async () => {
    const dbError = new Error('Database error');
    Category.findOne.mockRejectedValue(dbError);

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erreur lors de la création de la catégorie',
      error: dbError
    });
  });

  // Test pour l'invalidation du cache après une création réussie
  test('should invalidate cache after successful creation', async () => {
    const mockCategory = { name: 'Test Category', _id: '123' };
    Category.findOne.mockResolvedValue(null);
    Category.prototype.save.mockResolvedValue(mockCategory);

    await createCategory(req, res);

    expect(invalidateCache).toHaveBeenCalledWith('GET:/api/categories');
  });
});