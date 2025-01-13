import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface Instruction {
  id: string;
  step: string;
  instruction: string;
}

interface RecipeState {
  title: string;
  description: string;
  categoryId: string;
  image: File | null;
  source: string;
  anecdote: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  date: string;
  loading: boolean;
  successMessage: string;
  errorMessage: string;
}

const initialState: RecipeState = {
  title: '',
  description: '',
  categoryId: '',
  image: null,
  source: '',
  anecdote: '',
  ingredients: [],
  instructions: [],
  date: '',
  loading: false,
  successMessage: '',
  errorMessage: '',
};

const addRecipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setCategoryId: (state, action: PayloadAction<string>) => {
      state.categoryId = action.payload;
    },
    setImage: (state, action: PayloadAction<File | null>) => {
      state.image = action.payload;
    },
    setSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    setAnecdote: (state, action: PayloadAction<string>) => {
      state.anecdote = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.ingredients = action.payload;
    },
    setInstructions: (state, action: PayloadAction<Instruction[]>) => {
      state.instructions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
  },
});

export const {
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
} = addRecipeSlice.actions;

export default addRecipeSlice.reducer;
