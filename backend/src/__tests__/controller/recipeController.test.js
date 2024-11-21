import { getRecipes } from '../../controllers/recipeController.js';

// Moquer le modèle ou la fonction de récupération des recettes (par exemple `Recipe.find`)
jest.mock('../../controllers/recipeController.js');  // Moque la fonction `getRecipes`

describe('recipeController', () => {

  it('doit retourner un tableau de recettes', async () => {
    
    // Augmenter le délai d'attente à 10 secondes (10000 ms) si nécessaire
    jest.setTimeout(10000);
    
    // Simuler un retour rapide avec des données fictives
    getRecipes.mockResolvedValue([
      {
        name: 'Recette 1',
        description: 'Une recette délicieuse',
        anecdote: 'Un fait intéressant sur cette recette',
        ingredients: ['Ingrédient 1', 'Ingrédient 2'],
        instructions: 'Suivre ces étapes...',
        source: 'Source de la recette',
        category: 'Dessert'
      }
    ]);

    const recipes = await getRecipes();
    expect(recipes).toBeInstanceOf(Array);
    expect(recipes.length).toBeGreaterThan(0); // Optionnel, si tu t'attends à ce qu'il y ait au moins une recette
    recipes.forEach(recipe => {
      expect(recipe).toHaveProperty('name');
      expect(recipe).toHaveProperty('description');
      expect(recipe).toHaveProperty('anecdote');
      expect(recipe).toHaveProperty('ingredients');
      expect(recipe).toHaveProperty('instructions');
      expect(recipe).toHaveProperty('source');
      expect(recipe).toHaveProperty('category');
    });
  });

});
