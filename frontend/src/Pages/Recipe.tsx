import type React from "react";
import { useState, useEffect } from "react";
import myAxiosInstance from "../axios/axios";
import { useParams } from "react-router-dom";
import type { IRecipe } from "../@types/Recipe";
import type { IComment } from "../@types/Comment";
import { useCallback } from "react";

const Recipe: React.FC = () => {
  const { id } = useParams(); // Récupérer l'ID de la recette
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>(""); // Commentaire sous forme de string
  const [rating, setRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [scores, setScores] = useState<number[]>([]); // Stocke les scores des utilisateurs
  const [comments, setComments] = useState<IComment[]>([]); // Stocke les commentaires des utilisateurs
  const user = localStorage.getItem("userId") || "null"; // L'ID de l'utilisateur (ou null si non connecté)

  // Fonction pour récupérer les données de la recette, des scores et des commentaires
  const fetchData = useCallback(() => {
    if (id) {
      myAxiosInstance
        .get<IRecipe>(`/api/recipes/${id}`)
        .then((response) => {
          setRecipe(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Erreur de récupération de la recette");
          setLoading(false);
        });

      myAxiosInstance
        .get<number[]>(`/api/recipes/${id}/scores`)
        .then((response) => {
          console.log(scores);
          const scoresData = response.data;
          setScores(scoresData);
          const average =
            scoresData.reduce((sum: number, score: number) => sum + score, 0) /
            scoresData.length;
          setAverageRating(average || 0);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des scores", err);
        });

      myAxiosInstance
        .get<IComment[]>(`/api/recipes/${id}/comments`)
        .then((response) => {
          setComments(response.data);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des commentaires", err);
        });
    }
  }, [id, scores]);

  useEffect(() => {
    fetchData(); // Charger les données lorsque le composant se monte
  }, [fetchData]); // N'inclure que 'fetchData' dans les dépendances

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

    myAxiosInstance
      .post<IRecipe>(
        `/api/recipes/${id}`, // URL de l'API pour ajouter un commentaire
        {
          content: comment,
          rating: rating,
          userId: user, // L'ID de l'utilisateur (même si l'authentification est retirée)
        }
      )
      .then(() => {
        setComment(""); // Réinitialiser le commentaire
        setRating(0); // Réinitialiser la note
        fetchData(); // Récupérer à nouveau les commentaires et les scores à jour
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
            .sort((a, b) => a.step_number - b.step_number) // Trier les étapes par numéro
            .map((instruction) => (
              <li key={instruction.step_number}>
                <span>{instruction.instruction}</span>
              </li>
            ))}
        </ol>
      </div>

      {/* Affichage de la note moyenne de la recette */}
      <div className="average-rating">
        <h3>Note moyenne : {averageRating.toFixed(1)} / 5</h3>
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

      {/* Formulaire pour ajouter un commentaire et une note */}
      <div className="comment-section">
        <h3>Ajouter un commentaire</h3>
        <textarea
          value={typeof comment === "string" ? comment : ""}
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
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleRatingChange(star);
                }
              }}
            >
              ★
            </button>
          ))}
        </div>
        <button type="button" onClick={handleSubmitComment}>
          Soumettre
        </button>
      </div>

      {/* Message pour inciter à se connecter, mais les utilisateurs non authentifiés peuvent encore ajouter un commentaire */}
      <p className="redirect-message">
        Vous n'êtes pas connecté, mais vous pouvez quand même ajouter un
        commentaire.
      </p>
    </div>
  );
};

export default Recipe;
