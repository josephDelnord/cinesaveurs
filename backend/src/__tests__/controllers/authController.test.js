import { register } from '../../controllers/authController.js';
import User from '../../models/User.js';
import Role from '../../models/Role.js';
import bcrypt from 'bcryptjs';

jest.mock('../../models/User.js');
jest.mock('../../models/Role.js');
jest.mock('bcryptjs');

describe('register', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password@123',
        confirmPassword: 'Password@123',
        role: 'user',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should successfully register a user with a valid role', async () => {
    // Mocking Role and User creation
    Role.findOne.mockResolvedValue({ _id: 'roleId', role: 'user' });
    User.findOne.mockResolvedValue(null); // No existing user

    // Mock bcrypt hash
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // Calling the controller function
    await register(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur créé avec succès.' });
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it('should return 400 when user already exists', async () => {
    // Mocking Role and existing user
    Role.findOne.mockResolvedValue({ _id: 'roleId', role: 'user' });
    User.findOne.mockResolvedValue({}); // Existing user with same email

    // Calling the controller function
    await register(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Un utilisateur avec cet email existe déjà.' });
  });

  it('should return 400 when role is invalid', async () => {
    // Mocking invalid role
    Role.findOne.mockResolvedValue(null); // No matching role

    // Calling the controller function
    await register(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Rôle invalide.' });
  });

  it('should return 400 when validation fails', async () => {
    req.body.email = ''; // Invalid email

    // Calling the controller function
    await register(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Données invalides' }));
  });
});
