import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import type { IRecipe } from '../@types/recipe';

const Recipe: React.FC = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/recipes/${id}`)
        .then(response => {
          setRecipe(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur de récupération de la recette', err);
          setError('Erreur de récupération de la recette');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>Recette non trouvée</div>;

  return (
    <div className="recipe">
      <h1>{recipe.title}</h1>
      {recipe.image && <img src={`/img/${recipe.image}`} alt={recipe.title} />}
      <p><strong>Description :</strong> {recipe.description}</p>
      <p><strong>Anecdote :</strong> {recipe.anecdote}</p>
      <p><strong>Catégorie :</strong> {recipe.category.name}</p>
      <p><strong>Source :</strong> {recipe.source }</p>
      <p>
        <strong>Date de création :</strong>
        {recipe.createdAt
          ? new Date(recipe.createdAt).toLocaleDateString() // Convertir le timestamp en Date et formater
          : 'Date non disponible'}
      </p>

      <div className="content-wrapper">
      <h2>Ingrédients</h2>
      <ul className="ingredients">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name} : {ingredient.quantity} {ingredient.quantity_description} {ingredient.unit}
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol className="instructions">
        {recipe.instructions
          .sort((a, b) => a.step_number - b.step_number)  // Trier les étapes par numéro
          .map((instruction) => (
            <li key={instruction.step_number}>
              <span>{instruction.instruction}</span>
            </li>
          ))}
      </ol>
      </div>
    </div>
  );
};

export default Recipe;