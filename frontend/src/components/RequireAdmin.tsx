import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface RequireAdminProps {
  children: React.ReactElement;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // État de chargement si l'authentification est en cours
    return <p>Chargement...</p>;
  }

  if (!isAdmin) {
    // Rediriger vers la page de login ou une page non autorisée si l'utilisateur n'est pas admin
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RequireAdmin;
