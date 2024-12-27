import type React from "react";
import { useState, useEffect } from "react";
import myAxiosInstance from "../axios/axios";
import { useParams, useNavigate } from "react-router-dom";
import type { IRecipe } from "../@types/Recipe";
import type { IComment } from "../@types/Comment";

const Recipe: React.FC = () => {
  const { id } = useParams(); // Récupérer l'ID de la recette
  const navigate = useNavigate(); // Hook de redirection
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<IComment | string>(""); // Commentaire sous forme de string
  const [rating, setRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [scores, setScores] = useState<number[]>([]); // Stocke les scores des utilisateurs
  const isAuthenticated = localStorage.getItem("token");
  const user = localStorage.getItem("userId") || "null";

  useEffect(() => {
    console.log("useEffect appelé avec id:", id); // Vérifier si l'ID est bien récupéré
    if (id) {
      myAxiosInstance
        .get(`/api/recipes/${id}`)
        .then((response) => {
          console.log("Données de la recette reçues:", response.data); // Vérifier les données reçues
          setRecipe(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur de récupération de la recette", err);
          setError("Erreur de récupération de la recette");
          setLoading(false);
        });

      myAxiosInstance
        .get(`/api/recipes/${id}/scores`)
        .then((response) => {
          console.log("Scores reçus:", response.data); // Vérifier les scores reçus
          const scoresData = response.data;
          setScores(scoresData);
          const average =
            scoresData.reduce((sum: number, score: number) => sum + score, 0) /
            scoresData.length;
          setAverageRating(average || 0); // Calcul de la moyenne des scores
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des scores", err);
        });
    }
  }, [id]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitComment = () => {
    console.log("Commentaire:", comment); // Vérifiez la valeur du commentaire
    console.log("Note:", rating); // Vérifiez la valeur de la note

    if (!isAuthenticated) {
      console.error("Utilisateur non authentifié");
      return;
    }

    if (!comment || rating === 0) {
      console.error("Veuillez remplir tous les champs (commentaire et note)");
      return;
    }

    const token = localStorage.getItem("token"); // Récupérer le token du stockage local

    // Vérifier si le token est présent
    if (!token) {
      console.error("Token manquant");
      return;
    }

    myAxiosInstance
      .post(
        `/api/comments/${id}`, // URL de l'API pour ajouter un commentaire
        {
          content: comment,
          rating: rating,
          userId: user, // L'ID de l'utilisateur connecté
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes de la requête
          },
        }
      )
      .then((response) => {
        console.log("Commentaire ajouté avec succès");
        console.log(response.data);
        setComment(""); // Réinitialiser le commentaire
        setRating(0); // Réinitialiser la note
        const updatedScores = [...scores, rating];
        setScores(updatedScores);
        const updatedAverage =
          updatedScores.reduce((sum, score) => sum + score, 0) /
          updatedScores.length;
        setAverageRating(updatedAverage); // Mettre à jour la note moyenne
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du commentaire", err);
        setError("Erreur lors de l'ajout du commentaire");
      });
  };

  const handleRedirectToLogin = () => {
    navigate("/login"); // Rediriger l'utilisateur vers la page de connexion
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

      {/* Formulaire pour ajouter un commentaire et une note */}
      {isAuthenticated ? (
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
      ) : (
        <p className="redirect-message">
          Veuillez vous{" "}
          <button type="button" onClick={handleRedirectToLogin}>
            connecter
          </button>{" "}
          pour ajouter un commentaire.
        </p>
      )}
    </div>
  );
};

export default Recipe;
