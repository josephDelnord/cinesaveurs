import { useContext, type FC } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

interface RequireAdminProps {
  children: React.ReactElement;
}

const RequireAdmin: FC<RequireAdminProps> = ({ children }) => {
  const { isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) {
   return <Loading />;
  }

  if (!isAdmin) {
    // Rediriger vers la page de login ou une page non autorisée si l'utilisateur n'est pas admin
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RequireAdmin;
