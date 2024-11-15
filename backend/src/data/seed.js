// data/seed.js
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';
import Comment from '../models/Comment.js';
import Score from '../models/Score.js';
import { ROLES } from '../models/Role.js';

dotenv.config();
async function seedDatabase() {
    try {
        // Vider la base de données
        await Promise.all([
            Role.deleteMany({}),
            User.deleteMany({}),
            Recipe.deleteMany({}),
            Category.deleteMany({}),
            Comment.deleteMany({}),
            Score.deleteMany({})
        ]);

         // Créer les rôles
         const roles = await Role.create([
            { role: ROLES.GUEST },
            { role: ROLES.USER },
            { role: ROLES.ADMIN }
        ]);

        // Créer les utilisateurs
        const hashedPassword = await bcrypt.hash(process.env.JWT_SECRET, 10);
        const users = await User.create([
            {
                name: 'Guest User',
                email: 'guest@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.GUEST)._id
            },
            {
                name: 'Regular User',
                email: 'user@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.ADMIN)._id
            }
           
        ]);

        // Créer les catégories
        const categories = await Category.create([
            { name: 'Entrées' },
            { name: 'Plats principaux' },
            { name: 'Desserts' }
        ]);

        // Créer les recettes
        const recipes = await Recipe.create([
            {
                title: 'Tarte aux pommes',
                description: 'Une délicieuse tarte aux pommes traditionnelle',
                anecdote: 'Recette de grand-mère',
                ingredients: [
                    '6 pommes',
                    '1 pâte brisée',
                    '100g de sucre',
                    'Cannelle'
                ],
                instructions: [
                    'Préchauffer le four à 180°C',
                    'Éplucher et couper les pommes',
                    'Étaler la pâte',
                    'Disposer les pommes',
                    'Enfourner pendant 45 minutes',

                ],
                source: 'Livre de famille',
                categories: [categories[2]._id]
            }
        ]);

        // Créer les commentaires
        await Comment.create([
            {
                content: 'Excellent dessert !',
                user: users[1]._id,
                recipe: recipes[0]._id
            }
        ]);

        // Créer les scores
        await Score.create([
            {
                score: 5,
                user: users[1]._id,
                recipe: recipes[0]._id
            }
        ]);

        console.log('Base de données initialisée avec succès !');
    } catch (error) {
        console.error('Erreur lors du seeding :', error);
    }
}
export default seedDatabase;