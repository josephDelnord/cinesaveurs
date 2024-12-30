import { useEffect, useState } from "react";
import myAxiosInstance from "../axios/axios";
import { getTokenAndPseudoFromLocalStorage } from "../localstorage/localstorage";
import UserCard from "../components/UserCard";
import type { IUser } from "../@types/User";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false); // Nouvel état pour gérer le bouton

  useEffect(() => {
    const checkAuth = async () => {
      const user = getTokenAndPseudoFromLocalStorage();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      if (user.role === "admin") {
        setIsAdmin(true);
        try {
          const response = await myAxiosInstance.get<IUser[]>("/api/users");
          setUsers(response.data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des utilisateurs :",
            error
          );
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  const toggleShowAllUsers = () => {
    setShowAllUsers((prev) => !prev);
  };

  if (isAdmin === null) {
    return <div className="loading">Vérification des autorisations...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="error-message">
        Vous n'avez pas l'autorisation d'accéder à cette page.
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <h2>Gestion des Utilisateurs</h2>
      <div className="user-cards-container">
        {users.length > 0 ? (
          (showAllUsers ? users : users.slice(0, 4)).map((user) => (
            <UserCard key={user._id} {...user} />
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
