import { useState, useEffect, useCallback } from "react";
import myAxiosInstance from "../axios/axios";
import { useParams } from "react-router-dom";
import type { IRecipe } from "../@types/Recipe";
import type { IComment } from "../@types/Comment";
import type { IScore } from "../@types/Score";

const Recipe: React.FC = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>(""); // Commentaire de l'utilisateur
  const [rating, setRating] = useState<number>(0); // Note de l'utilisateur
  const [averageRating, setAverageRating] = useState<number>(0); // Note moyenne
  const [scores, setScores] = useState<IScore[]>([]); // Tableau des scores
  const [comments, setComments] = useState<IComment[]>([]); // Commentaires
  const user = localStorage.getItem("userId") || "null"; // ID utilisateur local

  // Fonction pour récupérer les données de la recette, scores et commentaires
  const fetchData = useCallback(() => {
    if (id) {
      setLoading(true); // Début de la récupération des données

      // Récupérer la recette
      const cachedRecipe = localStorage.getItem(`recipe-${id}`);
      if (cachedRecipe) {
        setRecipe(JSON.parse(cachedRecipe)); // Charger depuis le cache
      } else {
        myAxiosInstance
          .get<IRecipe>(`/api/recipes/${id}`)
          .then((response) => {
            setRecipe(response.data);
            localStorage.setItem(`recipe-${id}`, JSON.stringify(response.data)); // Sauvegarder dans le cache
          })
          .catch((err) => {
            console.error("Erreur lors de la récupération de la recette", err);
            setError("Erreur lors de la récupération de la recette");
          });
      }

      // Récupérer les scores de la recette
      const cachedScores = localStorage.getItem(`scores-${id}`);
      if (cachedScores) {
        const scoresData = JSON.parse(cachedScores);
        setScores(scoresData);
        const totalScore = scoresData.reduce(
          (sum, score) => sum + score.score,
          0
        );
        setAverageRating(totalScore / scoresData.length || 0);
      } else {
        myAxiosInstance
          .get<IScore[]>(`/api/recipes/${id}/scores`)
          .then((response) => {
            const scoresData = response.data;
            setScores(scoresData);

            // Calcul de la note moyenne des scores
            const totalScore = scoresData.reduce(
              (sum, score) => sum + score.score,
              0
            );
            setAverageRating(totalScore / scoresData.length || 0);

            localStorage.setItem(`scores-${id}`, JSON.stringify(scoresData)); // Sauvegarder dans le cache
          })
          .catch((err) => {
            console.error("Erreur lors de la récupération des scores", err);
          });
      }

      // Récupérer les commentaires de la recette
      const cachedComments = localStorage.getItem(`comments-${id}`);
      if (cachedComments) {
        setComments(JSON.parse(cachedComments)); // Charger depuis le cache
      } else {
        myAxiosInstance
          .get<IComment[]>(`/api/recipes/${id}/comments`)
          .then((response) => {
            setComments(response.data);
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

      setLoading(false); // Fin de la récupération des données
    }
  }, [id]);

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

    // Ajouter un commentaire via l'API
    myAxiosInstance
      .post<IRecipe>(`/api/recipes/${id}/comments`, {
        content: comment,
        score: rating,
        userId: user,
      })
      .then(() => {
        setComment(""); // Réinitialiser le commentaire
        setRating(0); // Réinitialiser la note
        fetchData(); // Recharger les données après soumission
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du commentaire", err);
        setError("Erreur lors de l'ajout du commentaire");
      });
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>Recette non trouvée</div>;

  return (
    <div className="recipe">
      <h1>{recipe.title}</h1>
      {recipe.image && <img src={`/img/${recipe.image}`} alt={recipe.title} />}
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
        <ul className="ingredients">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.name} : {ingredient.quantity}{" "}
              {ingredient.quantity_description} {ingredient.unit}
            </li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <ol className="instructions">
          {recipe.instructions
            .sort((a, b) => a.step_number - b.step_number)
            .map((instruction) => (
              <li key={instruction.step_number}>
                <span>{instruction.instruction}</span>
              </li>
            ))}
        </ol>
      </div>

      <div className="average-rating">
        <h3>Note moyenne : {averageRating.toFixed(1)} / 5</h3>
      </div>

      <div className="scores">
        <h3>Scores des utilisateurs :</h3>
        {scores.length > 0 ? (
          scores.map((score) => (
            <div key={score._id} className="score">
              <p>
                {score.user.username} : {score.score} / 5
              </p>
            </div>
          ))
        ) : (
          <p>Aucun score pour cette recette.</p>
        )}
      </div>

      <div className="comment-section">
        <h3>Commentaires :</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p>{comment.content}</p>
              <p>Par {comment.user.username}</p>
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour cette recette.</p>
        )}
      </div>

      <div className="comment-section">
        <h3>Ajouter un commentaire</h3>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Votre commentaire..."
          required
        />
        <div className="rating">
          <span>Note: </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`${rating >= star ? "filled" : ""}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </button>
          ))}
        </div>
        <button type="button" onClick={handleSubmitComment}>
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default Recipe;
