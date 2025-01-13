// src/pages/AddRecipe.tsx
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import myAxiosInstance from "axios";
import {
  setTitle,
  setDescription,
  setCategoryId,
  setImage,
  setSource,
  setAnecdote,
  setDate,
  setIngredients,
  setInstructions,
  setLoading,
  setSuccessMessage,
  setErrorMessage,
} from "../slices/addRecipeSlice";
import type { RootState } from "../store";
import Loading from "../components/Loading";

const AddRecipe: React.FC = () => {
  const dispatch = useDispatch();
  const {
    title,
    description,
    categoryId,
    image,
    source,
    anecdote,
    ingredients,
    instructions,
    date,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state: RootState) => state.addRecipe);

  // Fonction pour gérer le téléchargement de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(setImage(file));
    }
  };

  // Ajouter un ingrédient
  const handleAddIngredient = () => {
    const newIngredients = [
      ...ingredients,
      { id: Date.now().toString(), name: "", quantity: "", unit: "" },
    ];
    dispatch(setIngredients(newIngredients));
  };

  // Ajouter une instruction
  const handleAddInstruction = () => {
    const newInstructions = [
      ...instructions,
      { id: Date.now().toString(), step: "", instruction: "" },
    ];
    dispatch(setInstructions(newInstructions));
  };

  // Modifier un ingrédient
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    dispatch(setIngredients(newIngredients));
  };

  // Modifier une instruction
  const handleInstructionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newInstructions = [...instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    dispatch(setInstructions(newInstructions));
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true)); // Affiche le loader
    dispatch(setSuccessMessage("")); // Réinitialise le message de succès
    dispatch(setErrorMessage("")); // Réinitialise le message d'erreur

    // Création de FormData pour l'envoi au backend
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("source", source);
    formData.append("anecdote", anecdote);
    formData.append("date", date);
    formData.append("ingredients", JSON.stringify(ingredients)); // Liste d'ingrédients
    formData.append("instructions", JSON.stringify(instructions)); // Liste d'instructions

    if (image) {
      formData.append("image", image); // Ajout du fichier image si présent
    }

    try {
      const response = await myAxiosInstance.post("/api/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Recette ajoutée:", response.data);
      dispatch(setSuccessMessage("Recette ajoutée avec succès!"));
    } catch (error) {
      console.error("Erreur de soumission de la recette:", error);
      dispatch(setErrorMessage("Une erreur est survenue lors de l'ajout de la recette."));
    } finally {
      dispatch(setLoading(false)); // Masque le loader après la requête
    }
  };

  if (loading) {
    return <Loading />; // Affiche le loader pendant le chargement
  }

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
            onChange={(e) => dispatch(setTitle(e.target.value))}
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
            onChange={(e) => dispatch(setDescription(e.target.value))}
          />
        </div>

        {/* Champ Image */}
        <div className="input-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div>
              <h4>Prévisualisation de l'image :</h4>
              <img
                src={URL.createObjectURL(image)}
                alt="Prévisualisation"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
          )}
        </div>

        {/* Champ Source */}
        <div className="input-group">
          <label htmlFor="source">Source</label>
          <input
            type="text"
            id="source"
            placeholder="Source"
            value={source}
            onChange={(e) => dispatch(setSource(e.target.value))}
          />
        </div>

        {/* Champ Anecdote */}
        <div className="input-group">
          <label htmlFor="anecdote">Anecdote</label>
          <input
            type="text"
            id="anecdote"
            placeholder="Anecdote"
            value={anecdote}
            onChange={(e) => dispatch(setAnecdote(e.target.value))}
          />
        </div>

        {/* Champ Catégorie */}
        <div className="input-group">
          <label htmlFor="categoryId">Catégorie</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => dispatch(setCategoryId(e.target.value))}
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="1">Entrées</option>
            <option value="2">Plats principaux</option>
            <option value="3">Desserts</option>
            <option value="4">Boissons</option>
          </select>
        </div>

        {/* Ingrédients */}
        <div className="input-group">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label>Ingrédients</label>
            {ingredients.map((ingredient: { id: string | number, name: string, quantity: string, unit: string }, index: number) => (
            <div key={ingredient.id} className="ingredient-item">
              <input
              type="text"
              placeholder="Nom"
              value={ingredient.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleIngredientChange(index, "name", e.target.value)
              }
              />
              <input
              type="text"
              placeholder="Quantité"
              value={ingredient.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
              />
              <input
              type="text"
              placeholder="Unité"
              value={ingredient.unit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              />
            </div>
            ))}          <button type="button" onClick={handleAddIngredient}>
            Ajouter un ingrédient
          </button>
        </div>

        {/* Instructions */}
        <div className="input-group">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label>Instructions</label>
          {instructions.map((instruction, index) => (
            <div key={instruction.id} className="instruction-item">
              <input
                type="text"
                placeholder="Étape"
                value={instruction.step}
                onChange={(e) =>
                  handleInstructionChange(index, "step", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Instruction"
                value={instruction.instruction}
                onChange={(e) =>
                  handleInstructionChange(index, "instruction", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={handleAddInstruction}>
            Ajouter une instruction
          </button>
        </div>

        {/* Date */}
        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => dispatch(setDate(e.target.value))}
          />
        </div>

        {/* Affichage des messages de succès ou d'erreur */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Ajouter la recette</button>
      </form>
    </div>
  );
};
export default AddRecipe;
