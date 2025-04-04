// src/pages/Recipes.tsx
import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import myAxiosInstance from "../axios/axios";
import RecipeCard from "../components/RecipeCard";
import {
  setRecipes,
  setPopularRecipe,
  setLoading,
  setError,
  setSearchQuery,
  toggleShowAll,
  filterRecipes,
} from "../slices/recipesSlice";
import Loading from "../components/Loading";
import type { RootState, AppDispatch } from "../store";

const Recipes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    filteredRecipes,
    popularRecipe,
    searchQuery,
    loading,
    error,
    showAll,
  } = useSelector((state: RootState) => state.recipes);

  useEffect(() => {
    dispatch(setLoading(true));
    myAxiosInstance
      .get("/api/recipes")
      .then((response) => {
        const recipesData = response.data;
        dispatch(setRecipes(recipesData));

        const popular = recipesData.reduce(
          (prev: { popularity: number }, current: { popularity: number }) =>
            prev.popularity > current.popularity ? prev : current
        );
        dispatch(setPopularRecipe(popular));
      })
      .catch((error) => {
        console.error("Erreur de récupération des recettes:", error);
        dispatch(setError("Impossible de récupérer les recettes."));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(filterRecipes());
  };
  const handleToggleShowAll = () => {
    dispatch(toggleShowAll());
  };

  const displayedRecipes = showAll
    ? filteredRecipes
    : filteredRecipes.slice(0, 3);

  if (loading) return <Loading />;

  if (error) return <div>{error}</div>;

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <div className="add-recipe-button-container">
          <button
            type="button"
            className="add-recipe-button"
            onClick={() => navigate("/add-recipe")}
          >
            Ajouter une recette
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher une recette"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="search-input"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="search-button"
          >
            Rechercher
          </button>
        </div>
      </div>

      <h2>Bienvenue dans l'univers de Ciné Saveurs</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="recipe-cards-container">
        {displayedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            _id={recipe._id.toString()}
            title={recipe.title}
            description={recipe.description}
            source={recipe.source}
            image={recipe.image || ""}
          />
        ))}
      </div>

      <div className="show-more-button-container">
        <button
          type="button"
          onClick={handleToggleShowAll}
          className="show-more-button"
        >
          {showAll ? "Afficher moins" : "Voir toutes les recettes"}
        </button>
      </div>

      {popularRecipe && (
        <div className="container-popular-recipe">
          <div className="popular-recipe-title">
            <h4>{popularRecipe.title}</h4>
            <img src="/img/arrow.webp" loading="lazy" alt="arrow" />
          </div>
          <img
            className="title-popular-recipe"
            src="/img/mostpopular.webp"
            loading="lazy"
            alt="Most popular"
          />
          <div className="popular-recipe">
            <div className="popular-recipe-image">
              <img
                src={`/img/${popularRecipe.image}`}
                alt={popularRecipe.title}
              />
            </div>
            <div className="popular-recipe-info">
              <p>{popularRecipe.description}</p>
              <aside>{popularRecipe.source}</aside>
              <div className="static-score">*****</div>
              <div className="popular-score">
                {Array.from(
                  { length: popularRecipe.popularity },
                  (_, index) => (
                    <span
                      className="popular-stars"
                      key={`star-${popularRecipe._id}-${index}`}
                    >
                      *
                    </span>
                  )
                )}
              </div>
            </div>
            <Link to={`/recipe/${popularRecipe._id}`}>Voir la recette</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
