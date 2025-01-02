import type React from "react";
import { useState } from "react";

const AddRecipe: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null); // Changement pour accepter un fichier
  const [source, setSource] = useState("");
  const [anecdote, setAnecdote] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [date, setDate] = useState("");

  // Fonction pour gérer le téléchargement de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Récupère le fichier
    if (file) {
      setImage(file); // Sauvegarde le fichier dans l'état
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour envoyer la recette à l'API ou la sauvegarder
    console.log({
      title,
      description,
      categoryId,
      image, // On peut envoyer ce fichier à l'API si nécessaire
      source,
      anecdote,
      ingredients,
      instructions,
      date,
    });
  };

  return (
    <div className="add-recipe-page">
      <h1>Ajouter une recette</h1>
      <form onSubmit={handleSubmit}>
        {/* Champ Titre */}
        <div className="input-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Champ Description */}
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Champ Image */}
        <div className="input-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*" // Accepte uniquement les fichiers d'images
            onChange={handleImageChange}
          />
          {image && (
            <div>
              <h4>Prévisualisation de l'image :</h4>
              <img
                src={URL.createObjectURL(image)} // Affiche la prévisualisation de l'image téléchargée
                alt="Prévisualisation"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
          )}
        </div>

        {/* Autres champs */}
        <div className="input-group">
          <label htmlFor="source">Source</label>
          <input
            type="text"
            id="source"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="anecdote">Anecdote</label>
          <input
            type="text"
            id="anecdote"
            placeholder="Anecdote"
            value={anecdote}
            onChange={(e) => setAnecdote(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="categoryId">Catégorie</label>
          <input
            type="text"
            id="categoryId"
            placeholder="Catégorie"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="ingredients">Ingrédients</label>
          <input
            type="text"
            id="ingredients"
            placeholder="Ingrédients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddRecipe;
