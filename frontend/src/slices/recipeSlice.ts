import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IRecipe } from "../@types/Recipe";
import type { IScore } from "../@types/Score";
import type { IComment } from "../@types/Comment";

interface RecipeState {
  recipe: IRecipe | null;
  scores: IScore[];
  comments: IComment[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipe: null,
  scores: [],
  comments: [],
  loading: true,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    fetchRecipeRequest: (state) => {
      state.loading = true;
    },
    fetchRecipeSuccess: (state, action: PayloadAction<IRecipe>) => {
      state.recipe = action.payload;
      state.loading = false;
    },
    fetchRecipeFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchScoresSuccess: (state, action: PayloadAction<IScore[]>) => {
      state.scores = action.payload;
    },
    fetchCommentsSuccess: (state, action: PayloadAction<IComment[]>) => {
      state.comments = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  fetchRecipeRequest,
  fetchRecipeSuccess,
  fetchRecipeFailure,
  fetchScoresSuccess,
  fetchCommentsSuccess,
  setLoading,
} = recipeSlice.actions;

export default recipeSlice.reducer;
