// src/slices/recipesSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IRecipe } from '../@types/Recipe';

interface RecipesState {
  recipes: IRecipe[];
  filteredRecipes: IRecipe[];
  popularRecipe: IRecipe | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  showAll: boolean;
}

const initialState: RecipesState = {
  recipes: [],
  filteredRecipes: [],
  popularRecipe: null,
  searchQuery: '',
  loading: true,
  error: null,
  showAll: false,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes(state, action: PayloadAction<IRecipe[]>) {
      state.recipes = action.payload;
      state.filteredRecipes = action.payload; // Par défaut, afficher toutes les recettes
    },
    setPopularRecipe(state, action: PayloadAction<IRecipe>) {
      state.popularRecipe = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    toggleShowAll(state) {
      state.showAll = !state.showAll;
    },
    filterRecipes(state) {
      if (state.searchQuery.trim() === "") {
        state.filteredRecipes = state.recipes;
      } else {
        state.filteredRecipes = state.recipes.filter((recipe) => {
          const title = recipe.title ? recipe.title.toLowerCase() : "";
          const category = recipe.category?.name?.toLowerCase() || "";
          const source = recipe.source ? recipe.source.toLowerCase() : "";

          const isTitleMatch = title.includes(state.searchQuery.toLowerCase());
          const isCategoryMatch = category.includes(state.searchQuery.toLowerCase());
          const isSourceMatch = source.includes(state.searchQuery.toLowerCase());

          return isTitleMatch || isCategoryMatch || isSourceMatch;
        });
      }
    },
  },
});

export const {
  setRecipes,
  setPopularRecipe,
  setSearchQuery,
  setLoading,
  setError,
  toggleShowAll,
  filterRecipes,
} = recipesSlice.actions;

export default recipesSlice.reducer;
