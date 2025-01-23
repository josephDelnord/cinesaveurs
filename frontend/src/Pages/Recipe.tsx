import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipeRequest,
  fetchRecipeSuccess,
  fetchRecipeFailure,
  fetchScoresSuccess,
  fetchCommentsSuccess,
  setLoading,
} from "../slices/recipeSlice";
import myAxiosInstance from "../axios/axios";
import Loading from "../components/Loading";
import type { IRecipe } from "../@types/Recipe";
import type { IComment } from "../@types/Comment";
import type { IScore } from "../@types/Score";

const Recipe: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { recipe, scores, comments, loading, error } = useSelector(
    (state: {
      recipe: {
        recipe: IRecipe;
        scores: IScore[];
        loading: boolean;
        error: string | null;
        comments: IComment[];
      };
    }) => state.recipe
  );

  const [comment, setComment] = useState<string>(""); // Commentaire de l'utilisateur
  const [rating, setRating] = useState<number>(0); // Note de l'utilisateur

  const fetchData = useCallback(() => {
    if (id) {
      dispatch(setLoading(true)); // Début de la récupération des données

      // Récupérer la recette
      const cachedRecipe = localStorage.getItem(`recipe-${id}`);
      if (cachedRecipe) {
        dispatch(fetchRecipeSuccess(JSON.parse(cachedRecipe))); // Charger depuis le cache
      } else {
        dispatch(fetchRecipeRequest());
        myAxiosInstance
          .get<IRecipe>(`/api/recipes/${id}`)
          .then((response) => {
            dispatch(fetchRecipeSuccess(response.data));
            localStorage.setItem(`recipe-${id}`, JSON.stringify(response.data)); // Sauvegarder dans le cache
          })
          .catch((err) => {
            console.error("Erreur lors de la récupération de la recette", err);
            dispatch(
              fetchRecipeFailure("Erreur lors de la récupération de la recette")
            );
          });
      }

      // Récupérer les scores de la recette
      const cachedScores = localStorage.getItem(`scores-${id}`);
      if (cachedScores) {
        dispatch(fetchScoresSuccess(JSON.parse(cachedScores))); // Charger depuis le cache
      } else {
        myAxiosInstance
          .get<IScore[]>(`/api/recipes/${id}/scores`)
          .then((response) => {
            dispatch(fetchScoresSuccess(response.data));
            localStorage.setItem(`scores-${id}`, JSON.stringify(response.data)); // Sauvegarder dans le cache
          })
          .catch((err) => {
            console.error("Erreur lors de la récupération des scores", err);
          });
      }

      // Récupérer les commentaires de la recette
      const cachedComments = localStorage.getItem(`comments-${id}`);
      if (cachedComments) {
        dispatch(fetchCommentsSuccess(JSON.parse(cachedComments))); // Charger depuis le cache
      } else {
        myAxiosInstance
          .get<IComment[]>(`/api/recipes/${id}/comments`)
          .then((response) => {
            dispatch(fetchCommentsSuccess(response.data));
            localStorage.setItem(
              `comments-${id}`,
              JSON.stringify(response.data)
            ); // Sauvegarder dans le cache
          })
          .catch((err) => {
            console.error(
              "Erreur lors de la récupération des commentaires",
              err
            );
          });
      }

      dispatch(setLoading(false)); // Fin de la récupération des données
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitComment = () => {
    if (!comment || rating === 0) {
      console.error("Veuillez remplir tous les champs (commentaire et note)");
      return;
    }

    const userId = localStorage.getItem("userId") || "defaultUserId"; // Utilisateur actuel

    // Ajouter un commentaire via l'API
    myAxiosInstance
      .post<IRecipe>(`/api/recipes/${id}/comments`, {
        content: comment,
        score: rating,
        userId,
      })
      .then(() => {
        setComment(""); // Réinitialiser le commentaire
        setRating(0); // Réinitialiser la note
        fetchData(); // Recharger les données après soumission
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du commentaire", err);
      });
  };

  if (loading) return <Loading />;

  if (error) return <div>{error}</div>;

  if (!recipe) return <div>Recette non trouvée</div>;

  return (
    <div className="recipe">
      <h1>{recipe.title}</h1>
      {recipe.image && <img src={`/img/${recipe.image}`} loading="lazy" alt={recipe.title} />}
      <p>
        <strong>Description :</strong> {recipe.description}
      </p>
      <p>
        <strong>Anecdote :</strong> {recipe.anecdote}
      </p>
      <p>
        <strong>Catégorie :</strong> {recipe.category.name}
      </p>
      <p>
        <strong>Source :</strong> {recipe.source}
      </p>
      <p>
        <strong>Date de création :</strong>
        {recipe.createdAt
          ? new Date(recipe.createdAt).toLocaleDateString()
          : "Date non disponible"}
      </p>

      <div className="content-wrapper">
        <h2>Ingrédients</h2>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th>Nom de l'ingrédient</th>
              <th>Quantité</th>
              <th>Unité</th>
            </tr>
          </thead>
          <tbody>
            {recipe.ingredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Instructions</h2>
        <table className="instructions-table">
          <thead>
            <tr>
              <th>Étape</th>
              <th>Instruction</th>
            </tr>
          </thead>
          <tbody>
            {recipe.instructions.map((instruction) => (
              <tr key={instruction.step_number}>
                <td>{instruction.step_number}</td>
                <td>{instruction.instruction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note-section">
        Note moyenne :{" "}
        {scores.length > 0
          ? (
              scores.reduce((total, score) => total + score.score, 0) /
              scores.length
            ).toFixed(1)
          : 0}{" "}
        / 5
      </div>
      <div className="comment-section">
        <h3>Ajouter un commentaire</h3>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Votre commentaire..."
        />
        <div className="rating">
          <span>Note: </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={rating >= star ? "filled" : ""}
            >
              ★
            </button>
          ))}
        </div>
        <button type="button" onClick={handleSubmitComment}>
          Soumettre
        </button>
      </div>

      <div className="comments-list">
        <h3>Commentaires</h3>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <li key={comment.createdAt}>
                <div>
                  <strong>{comment.user.username}</strong> -{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <p>{comment.content}</p>
                <div>Note: {comment.rating} / 5</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun commentaire pour cette recette.</p>
        )}
      </div>
    </div>
  );
};

export default Recipe;
