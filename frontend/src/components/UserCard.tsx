import type React from "react";
// import { Link } from "react-router-dom";
import type { IUser } from "../@types/User";

// Composant pour afficher un utilisateur sous forme de carte
const UserCard: React.FC<IUser> = ({
  username,
  email,
  status,
  role,
  createdAt,
}) => {
  // Fonction pour formater la date en jj/mm/aaaa
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = `0${date.getDate()}`.slice(-2); // Ajoute un 0 devant les jours < 10
    const month = `0${date.getMonth() + 1}`.slice(-2); // Ajoute un 0 devant les mois < 10
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="user-card">
      {/* <Link to={`/users/${_id}`}> + </Link> */}
      <h3>{username}</h3>
      <p>Email: {email}</p>
      <p>Statut: {status?.status_name || "N/A"}</p>
      <p>Rôle: {role?.role_name || "N/A"}</p>
      <p>Date d'inscription: {formatDate(createdAt)}</p>
    </div>
  );
};

export default UserCard;
