import dotenv from 'dotenv';
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
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.ADMIN)._id, 
            },
            {
                name: 'Guest User',
                email: 'guest@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.GUEST)._id, 
            },
            {
                name: 'Chef Gordon Ramsay',
                email: 'gordon@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id,
            },
            {
                name: 'Regular User',
                email: 'user@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'Alice Dupont',
                email: 'alice.dupont@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'Bob Martin',
                email: 'bob.martin@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'Claire Lefevre',
                email: 'claire.lefevre@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'David Leclerc',
                email: 'david.leclerc@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'Eva Durand',
                email: 'eva.durand@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id,
            },
            {
                name: 'Frank Sorel',
                email: 'frank.sorel@example.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'Jon Snow',
                email: 'jonsnow@got.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id,
            },
            {
                name: 'Sherlock Holmes',
                email: 'sherlock@bakerstreet.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            },
            {
                name: 'Tony Stark',
                email: 'tony.stark@starkindustries.com',
                password: 'Password@12345',
                confirmPassword: 'Password@12345',
                role: roles.find(r => r.role === ROLES.USER)._id, 
            }
        ]);

        // Créer des catégories de recettes
        const categories = await Category.create([
            { name: 'Entrées' },
            { name: 'Plats principaux' },
            { name: 'Desserts' },
            { name: 'Boissons' },
            { name: 'Recettes végétariennes' },
            { name: 'Recettes inspirées de films et séries' }
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
                category: [categories[1]._id]
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
                category: [categories[2]._id]
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
                category: [categories[3]._id]
            },
            {
                title: 'Tarte aux pommes de la Reine',
                description: 'Une tarte aux pommes qui rend hommage à la Reine des Neiges.',
                anecdote: 'Recette inspirée par Elsa dans le film "La Reine des Neiges"',
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
                source: 'La Reine des Neiges',
                category: [categories[2]._id]
            },
            {
                title: 'Spaghetti de l\'italien préféré',
                description: 'Recette simple et rapide de spaghetti à la sauce tomate',
                anecdote: 'Inspiré de la cuisine d\'Italie dans "Luca"',
                ingredients: [
                    'Spaghetti',
                    'Tomates fraîches',
                    'Basilic',
                    'Fromage râpé'
                ],
                instructions: [
                    'Faire bouillir l\'eau',
                    'Cuire les pâtes',
                    'Préparer la sauce avec tomates et basilic',
                    'Mélanger et servir avec le fromage râpé'
                ],
                source: 'Luca',
                category: [categories[1]._id]
            },
            {
                title: 'Pizza à la mode de Stranger Things',
                description: 'Pizza classique inspirée des années 80, avec une touche rétro.',
                anecdote: 'Recette favorite de Eleven dans "Stranger Things"',
                ingredients: [
                    'Pâte à pizza',
                    'Tomates',
                    'Fromage mozzarella',
                    'Pepperoni',
                    'Olives noires'
                ],
                instructions: [
                    'Préchauffer le four à 220°C',
                    'Étaler la pâte',
                    'Ajouter la sauce tomate',
                    'Disposer les tranches de mozzarella et de pepperoni',
                    'Enfourner pendant 15-20 minutes'
                ],
                source: 'Stranger Things',
                category: [categories[1]._id]
            },
            {
                title: 'Cocktail Stark',
                description: 'Un cocktail énergisant inspiré de Tony Stark et ses gadgets.',
                anecdote: 'Recette de cocktail inspirée de Tony Stark dans "Avengers"',
                ingredients: [
                    'Whisky',
                    'Gin',
                    'Jus d\'orange',
                    'Glaçons'
                ],
                instructions: [
                    'Verser les ingrédients dans un shaker',
                    'Ajouter des glaçons',
                    'Secouer et servir dans un verre à cocktail'
                ],
                source: 'Avengers',
                category: [categories[3]._id]
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
            },
            {
                content: 'Cette pizza est incroyable, tout comme dans la série !',
                user: users[5]._id,
                recipe: recipes[6]._id
            },
            {
                content: 'Je me sens comme Tony Stark en buvant ce cocktail.',
                user: users[4]._id,
                recipe: recipes[7]._id
            },
            {
                content: 'La tarte aux pommes est délicieuse, comme la Reine des Neiges !',
                user: users[6]._id,
                recipe: recipes[4]._id
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
                recipe: recipes[6]._id
            },
            {
                score: 5,
                user: users[5]._id,
                recipe: recipes[5]._id
            },
            {
                score: 4,
                user: users[6]._id,
                recipe: recipes[6]._id
            },
            {
                score: 5,
                user: users[7]._id,
                recipe: recipes[4]._id
            }
        ]);

        console.log('Base de données initialisée avec succès !');
    } catch (error) {
        console.error('Erreur lors du seeding :', error);
    }
}

export default seedDatabase;
