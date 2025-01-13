import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Définition de l'état initial
interface FavoritesState {
  favoriteRecipes: string[]; // Une liste d'ID de recettes favorites
}

const initialState: FavoritesState = {
  favoriteRecipes: [],
};

// Création du slice
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteRecipes.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteRecipes = state.favoriteRecipes.filter(
        (recipeId) => recipeId !== action.payload
      );
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
