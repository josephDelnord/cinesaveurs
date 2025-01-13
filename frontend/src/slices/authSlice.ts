// src/features/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  isUser: false,
  isLoading: true, // Initialisation sur true pour simuler un chargement d'authentification
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserStatus: (state, action: PayloadAction<boolean>) => {
      state.isUser = action.payload;
    },
    setAdminStatus: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("authToken", "votreToken"); // Stockage du token
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isUser = false;
      localStorage.removeItem("authToken"); // Suppression du token
    },
  },
});

export const { setAdminStatus, setLoadingStatus, setAuthenticated, setUserStatus, login, logout } = authSlice.actions;

export default authSlice.reducer;
