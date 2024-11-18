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

        // Créer des utilisateurs avec des données fictives
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
            },
            // Ajout de nombreux autres utilisateurs
            {
                name: 'Alice Dupont',
                email: 'alice.dupont@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            },
            {
                name: 'Bob Martin',
                email: 'bob.martin@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            },
            {
                name: 'Claire Lefevre',
                email: 'claire.lefevre@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            },
            {
                name: 'David Leclerc',
                email: 'david.leclerc@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            },
            {
                name: 'Eva Durand',
                email: 'eva.durand@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            },
            {
                name: 'Frank Sorel',
                email: 'frank.sorel@example.com',
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: roles.find(r => r.role === ROLES.USER)._id
            }
        ]);

        // Créer des catégories de recettes
        const categories = await Category.create([
            { name: 'Entrées' },
            { name: 'Plats principaux' },
            { name: 'Desserts' },
            { name: 'Boissons' },
            { name: 'Recettes végétariennes' }
        ]);

        // Créer des recettes avec des données fictives
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
                    'Enfourner pendant 45 minutes'
                ],
                source: 'Livre de famille',
                category: [categories[2]._id]
            },
            {
                title: 'Lasagne végétarienne',
                description: 'Un plat italien revisité avec des légumes',
                anecdote: 'Un plat qui plait à tout le monde',
                ingredients: [
                    'Pâtes à lasagne',
                    'Aubergines',
                    'Courgettes',
                    'Tomates',
                    'Fromage râpé'
                ],
                instructions: [
                    'Préchauffer le four à 200°C',
                    'Faire cuire les légumes',
                    'Alterner les couches de pâtes et de légumes',
                    'Ajouter le fromage râpé',
                    'Enfourner pendant 30 minutes'
                ],
                source: 'Recette de famille',
                category: [categories[1]._id]  // Plats principaux
            },
            {
                title: 'Crêpes au chocolat',
                description: 'De délicieuses crêpes fourrées au chocolat',
                anecdote: 'Un dessert qui ravit les enfants',
                ingredients: [
                    '250g de farine',
                    '2 œufs',
                    '50g de sucre',
                    '200g de chocolat'
                ],
                instructions: [
                    'Préparer la pâte à crêpes',
                    'Faire cuire les crêpes',
                    'Faire fondre le chocolat',
                    'Garnir les crêpes de chocolat fondu',
                    'Servir chaud'
                ],
                source: 'Recette trouvée sur Internet',
                category: [categories[2]._id]  // Desserts
            },
            {
                title: 'Jus de fruits frais',
                description: 'Un jus de fruits frais fait maison',
                anecdote: 'Rien de tel qu’un jus frais pour bien démarrer la journée',
                ingredients: [
                    '1 orange',
                    '1 pomme',
                    '1 carotte'
                ],
                instructions: [
                    'Presser l\'orange',
                    'Mixer la pomme et la carotte',
                    'Mélanger et servir frais'
                ],
                source: 'Recette familiale',
                category: [categories[3]._id]  // Boissons
            }
        ]);

        // Créer des commentaires
        await Comment.create([
            {
                content: 'Excellent dessert, mes enfants ont adoré !',
                user: users[1]._id,
                recipe: recipes[0]._id
            },
            {
                content: 'Un plat végétarien délicieux, facile à préparer.',
                user: users[2]._id,
                recipe: recipes[1]._id
            },
            {
                content: 'Recette rapide et simple, j’ai adoré !',
                user: users[3]._id,
                recipe: recipes[2]._id
            },
            {
                content: 'Très bon jus de fruits, idéal pour le matin.',
                user: users[4]._id,
                recipe: recipes[3]._id
            }
        ]);

        // Créer des scores
        await Score.create([
            {
                score: 5,
                user: users[1]._id,
                recipe: recipes[0]._id
            },
            {
                score: 4,
                user: users[2]._id,
                recipe: recipes[1]._id
            },
            {
                score: 3,
                user: users[3]._id,
                recipe: recipes[2]._id
            },
            {
                score: 5,
                user: users[4]._id,
                recipe: recipes[3]._id
            }
        ]);

        console.log('Base de données initialisée avec succès !');
    } catch (error) {
        console.error('Erreur lors du seeding :', error);
    }
}

export default seedDatabase;
