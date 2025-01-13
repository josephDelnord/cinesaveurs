// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import errorReducer from './slices/errorSlice';
import favoritesReducer from './slices/favoritesSlice';
import addRecipeReducer from './slices/addRecipeSlice';
import recipesReducer from './slices/recipesSlice';
import recipeReducer from './slices/recipeSlice';
import authReducer from './slices/authSlice';

// Configuration du store avec le reducer du counter
export const store = configureStore({
  reducer: {
    error: errorReducer,
    favorites: favoritesReducer,
    addRecipe: addRecipeReducer,
    recipes: recipesReducer,
    recipe: recipeReducer,
    auth: authReducer,

  },
});

// Typage de l'état global
export type RootState = ReturnType<typeof store.getState>;
// Typage du dispatch
export type AppDispatch = typeof store.dispatch;
