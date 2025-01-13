// src/components/AuthButton.tsx
import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setLoadingStatus, setAuthenticated } from "../slices/authSlice";
import type { RootState } from "../store";

const AuthButton: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Si un token est présent, on considère l'utilisateur comme authentifié
    if (token) {
      dispatch(setAuthenticated(true));
    } else {
      dispatch(setAuthenticated(false));
    }
    dispatch(setLoadingStatus(false)); // On arrête le chargement quand on a vérifié
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(login());
    dispatch(setAuthenticated(true));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setAuthenticated(false));
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div>
      {isAuthenticated ? (
        <button type="button" onClick={handleLogout}>Se déconnecter</button>
      ) : (
        <button type="button" onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
};

export default AuthButton;
