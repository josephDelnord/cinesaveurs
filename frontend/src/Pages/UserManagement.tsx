import { useEffect, useState } from "react";
import myAxiosInstance from "../axios/axios";
import {
  getTokenAndPseudoFromLocalStorage,
  isTokenValid,
} from "../localstorage/localstorage";
import UserCard from "../components/UserCard";
import type { IUser } from "../@types/User";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = getTokenAndPseudoFromLocalStorage();

      // Si l'utilisateur n'est pas authentifié ou si le token est invalide, on redirige
      if (!user || !isTokenValid(user.token)) {
        setIsAdmin(false);
        setErrorMessage(
          "Le token est invalide ou expiré. Veuillez vous reconnecter."
        );
        setLoading(false);
        return;
      }

      // Vérification du rôle
      if (user.role === "admin") {
        setIsAdmin(true);
        try {
          // Tentative de récupération des utilisateurs
          const response = await myAxiosInstance.get<IUser[]>("/api/users", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des utilisateurs:",
            error
          );
          setErrorMessage(
            "Une erreur est survenue lors de la récupération des utilisateurs."
          );
        }
      } else {
        setIsAdmin(false);
        setErrorMessage(
          "Vous n'avez pas l'autorisation d'accéder à cette page."
        );
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const toggleShowAllUsers = () => {
    setShowAllUsers((prev) => !prev);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await myAxiosInstance.delete(`/api/users/${userId}`);
      // Mettre à jour la liste des utilisateurs après suppression
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  };

  const handleUpdateUser = (userId: string) => {
    // Redirige vers la page de mise à jour de l'utilisateur
    navigate(`/admin/dashboard/users/update/${userId}`);
  };

  // Affichage pendant le chargement
  if (loading) {
    return <Loading />;
  }

  // Affichage en cas d'erreur ou d'absence d'accès
  if (!isAdmin) {
    return (
      <div className="error-message">
        {errorMessage ||
          "Vous n'avez pas l'autorisation d'accéder à cette page."}
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <h2>Gestion des Utilisateurs</h2>
      <div className="user-cards-container">
        {users.length > 0 ? (
          (showAllUsers ? users : users.slice(0, 4)).map((user) => (
            <div key={user._id} className="user-card-container">
              <UserCard {...user} />
              <div className="user-actions">
                <button
                  type="button"
                  onClick={() => handleUpdateUser(user._id)}
                  className="update-btn"
                >
                  Mettre à jour
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(user._id)}
                  className="delete-btn"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>Aucun utilisateur en ligne.</div>
        )}
      </div>
      <div className="show-more-button-container">
        <button
          type="button"
          className="show-more-button"
          onClick={toggleShowAllUsers}
        >
          {showAllUsers ? "Voir moins" : "Voir plus"}
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
