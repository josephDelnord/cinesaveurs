import { useEffect, useState } from 'react';
import myAxiosInstance from "../axios/axios";
import type { IUser } from "../@types/User";
import Loading from "../components/Loading";
import axios from 'axios';
import type { AxiosError } from 'axios';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setError("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Récupération du profil pour userId:', userId);

        // Configure le token dans les headers
        myAxiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await myAxiosInstance.get<IUser>(`/users/${userId}`);

        if (!response.data) {
          throw new Error("Données utilisateur non trouvées");
        }

        setUserInfo(response.data);
      } catch (error: unknown) {
        console.error("Erreur lors de la récupération du profil:", error);

        let errorMessage = "Erreur lors de la récupération du profil";

        if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 404) {
          errorMessage = "Profil non trouvé";
        } else if (axios.isAxiosError(error) && error.response?.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
          // Optionnel : Redirection vers la page de login
          // window.location.href = '/login';
        }

        setError(errorMessage);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Erreur: {error}</p>
        {error.includes('Session expirée') ? (
          <button
            onClick={() => { window.location.href = '/login'; }}
            type="button"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Se reconnecter
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (!userInfo) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Mon Profil
      </h1>
      <div className="space-y-2">
        <p><strong>Nom d'utilisateur:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Role:</strong> {userInfo.role.role_name}</p>
        <p><strong>Statut:</strong> {userInfo.status.status_name}</p>
        <p>
          <strong>Date de création: </strong>
          {userInfo.createdAt
            ? new Date(userInfo.createdAt).toLocaleDateString()
            : "Date non disponible"}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;