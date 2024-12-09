import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myAxiosInstance from '../axios/axios';
import type { IUser } from '../@types/User';

const AdminProfile: React.FC = () => {
  // Récupérer l'ID utilisateur depuis les paramètres de l'URL
  const { userId } = useParams<{ userId: string }>(); 
  console.log('User ID from params:', userId); // Vérifiez que l'ID utilisateur est récupéré

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // Vérification de l'authentification et du rôle
  useEffect(() => {
    if (!token || role !== 'admin') {
      window.location.href = '/login'; // Redirection si non authentifié ou non admin
    }
  }, [token, role]);

  // Appel API pour récupérer les données de l'utilisateur
  useEffect(() => {
    if (userId && token) {
      const fetchUserData = async () => {
        try {
          const response = await myAxiosInstance.get(`/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('User data:', response.data); // Log de la réponse pour vérifier les données
          setUser(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors de la récupération des données:', err);
          setError('Erreur lors de la récupération des données de l\'utilisateur.');
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [userId, token]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Utilisateur introuvable.</div>;

  return (
    <div className="admin-profile">
      <h1>Profil de l'utilisateur</h1>
      <div>
        <p><strong>Nom:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rôle:</strong> {user.role.role_name}</p>
        <p><strong>Statut:</strong> {user.status.status_name}</p>
        <p><strong>Créé le:</strong> {user.createdAt}</p>
        <p><strong>Dernière mise à jour:</strong> {user.updatedAt}</p>
      </div>
    </div>
  );
};

export default AdminProfile;
