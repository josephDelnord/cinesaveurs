import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Définir l'état initial
interface ErrorState {
  isPageNotFound: boolean;
}

const initialState: ErrorState = {
  isPageNotFound: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setPageNotFound: (state, action: PayloadAction<boolean>) => {
      state.isPageNotFound = action.payload;
    },
  },
});

export const { setPageNotFound } = errorSlice.actions;

export default errorSlice.reducer;
