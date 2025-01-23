// src/components/RecipeCard.tsx
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../slices/favoritesSlice";
import type { RootState } from "../store";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  source: string;
  image: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  _id,
  title,
  description,
  source,
  image,
}) => {
  const dispatch = useDispatch();
  const favoriteRecipes = useSelector(
    (state: RootState) => state.favorites.favoriteRecipes
  );

  // Vérifier si la recette est déjà dans les favoris
  const isFavorite = favoriteRecipes.includes(_id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(_id)); // Retirer des favoris
    } else {
      dispatch(addFavorite(_id)); // Ajouter aux favoris
    }
  };

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${_id}`}>+</Link>
      <img src={`img/${image}`} loading="lazy" alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <h2>{source}</h2>

      {/* Afficher un bouton pour ajouter/enlever des favoris */}
      <button  className="favorite-button" type="button" onClick={handleToggleFavorite}>
        {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      </button>
    </div>
  );
};
export default RecipeCard;
