import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import myAxiosInstance from "../axios/axios";
import { getTokenAndPseudoFromLocalStorage } from "../localstorage/localstorage";
import type { IUser } from "../@types/User";
import Loading from "../components/Loading";
import type { AxiosError } from "axios";

const UserUpdate: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Récupérer l'ID de l'utilisateur depuis l'URL
  const [, setUser] = useState<IUser | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = getTokenAndPseudoFromLocalStorage();
      if (!userData || !userId) {
        setErrorMessage("Utilisateur non trouvé ou non authentifié.");
        setLoading(false);
        return;
      }

      try {
        const response = await myAxiosInstance.get<IUser>(
          `/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setRole(response.data.role?.role_name || "");
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error
        );
        setErrorMessage(
          "Une erreur est survenue lors du chargement des données utilisateur."
        );
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = getTokenAndPseudoFromLocalStorage();
    if (!userData || !userId) {
      setErrorMessage("Utilisateur non authentifié.");
      return;
    }

    // Vérification des données avant l'envoi
    if (!username || !email || !role) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return;
    }

    const updatedUser = { username, email, role };

    try {
      setLoading(true);

      // Appel API pour mettre à jour l'utilisateur
      await myAxiosInstance.put(`/api/users/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      // Rediriger après la mise à jour réussie
      navigate(`/admin/dashboard/users/update/${userId}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setErrorMessage(
        (error as AxiosError<{ message?: string }>).response?.data?.message ||
          "Une erreur est survenue lors de la mise à jour de l'utilisateur."
      );
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className="user-update-page">
      <h2>Mettre à jour l'utilisateur</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rôle</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;
