import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import myAxiosInstance from "../axios/axios";
import RecipeCard from "../components/RecipeCard";
import type { IRecipe } from "../@types/Recipe";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]); // Liste des recettes
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[]>([]); // Liste des recettes filtrées
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs
  const [popularRecipe, setPopularRecipe] = useState<IRecipe | null>(null); // Recette populaire
  const [showAll, setShowAll] = useState<boolean>(false); // Afficher toutes les recettes
  const [searchQuery, setSearchQuery] = useState(""); // Texte de recherche

  // Fonction pour gérer la recherche
  const handleSearch = () => {
    console.log("Requête de recherche:", searchQuery); // Debug : afficher la requête de recherche

    if (searchQuery.trim() === "") {
      // Si la recherche est vide, réinitialiser les recettes filtrées à toutes les recettes
      setFilteredRecipes(recipes);
      console.log("Recettes réinitialisées:", recipes); // Debug : afficher les recettes initiales
    } else {
      // Filtrer les recettes par title, category.name ou source
      const filteredResults = recipes.filter((recipe) => {
        // Vérification de l'existence de title, category.name et source avant de faire la comparaison
        const title = recipe.title ? recipe.title.toLowerCase() : ""; // Vérifier title
        const category = recipe.category?.name?.toLowerCase() || ""; // Vérifier category.name
        const source = recipe.source ? recipe.source.toLowerCase() : ""; // Vérifier source

        // Comparer avec la requête de recherche
        const isTitleMatch = title.includes(searchQuery.toLowerCase());
        const isCategoryMatch = category.includes(searchQuery.toLowerCase());
        const isSourceMatch = source.includes(searchQuery.toLowerCase());

        // Debug : afficher si une recette correspond
        console.log(
          "Matching recipe:",
          recipe.title,
          isTitleMatch,
          isCategoryMatch,
          isSourceMatch
        );

        return isTitleMatch || isCategoryMatch || isSourceMatch;
      });

      console.log("Résultats filtrés:", filteredResults); // Debug : afficher les recettes filtrées

      setFilteredRecipes(filteredResults); // Mettre à jour les recettes filtrées
    }
  };

  useEffect(() => {
    // Charger les recettes depuis l'API
    myAxiosInstance
      .get("/api/recipes")
      .then((response) => {
        const recipesData = response.data;
        setRecipes(recipesData); // Mettre à jour les recettes
        setFilteredRecipes(recipesData); // Par défaut, afficher toutes les recettes

        // Trouver la recette la plus populaire
        const popular = recipesData.reduce(
          (prev: IRecipe, current: IRecipe) => {
            return prev.popularity > current.popularity ? prev : current;
          }
        );
        setPopularRecipe(popular); // Mettre à jour l'état avec la recette la plus populaire
      })
      .catch((error) => {
        console.error("Erreur de récupération des recettes:", error);
        setError("Impossible de récupérer les recettes.");
      });
  }, []); // Ce useEffect se déclenche une seule fois lors du montage du composant

  const toggleShowAll = () => {
    setShowAll((prev) => !prev); // Bascule l'état showAll
  };

  // Affichage des recettes (affiche soit toutes les recettes, soit seulement les 3 premières)
  const displayedRecipes = showAll
    ? filteredRecipes
    : filteredRecipes.slice(0, 3);

  return (
    <div className="recipes-page">
      {/* Barre de recherche */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher une recette"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="button" onClick={handleSearch} className="search-button">
          Rechercher
        </button>
      </div>

      <h2>Bienvenue dans l'univers de Ciné Délices</h2>

      {/* Affichage des erreurs s'il y en a une */}
      {error && <p className="error-message">{error}</p>}

      {/* Affichage des cartes de recettes */}
      <div className="recipe-cards-container">
        {displayedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            _id={recipe._id.toString()}
            title={recipe.title}
            description={recipe.description}
            source={recipe.source}
            image={recipe.image || ""} // Passe l'image à RecipeCard
          />
        ))}
      </div>

      {/* Bouton pour afficher ou masquer les autres recettes */}
      <div className="show-more-button-container">
        <button
          type="button"
          onClick={toggleShowAll}
          className="show-more-button"
        >
          {showAll ? "Afficher moins" : "Voir toutes les recettes"}
        </button>
      </div>

      {/* Affichage de la recette populaire */}
      {popularRecipe && (
        <div className="container-popular-recipe">
          <div className="popular-recipe-title">
            <h4>{popularRecipe.title}</h4>
            <img src="/img/arrow.webp" alt="arrow" />
          </div>

          <img
            className="title-popular-recipe"
            src="/img/mostpopular.webp"
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
