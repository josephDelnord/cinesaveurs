import React from 'react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  source: string;
  image: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ _id, title, description, source, image }) => {
  return (
    <div className="recipe-card">
      {/* Construction du chemin d'image relatif */}
      <Link to={`/recipe/${_id}`}> + </Link>
      <img src={`img/${image}`} alt={title} /> {/* Affichage de l'image */}
      <h3>{title}</h3>
      <p>{description}</p>
      <h2>{source}</h2>
    </div>
  );
};

export default RecipeCard;
