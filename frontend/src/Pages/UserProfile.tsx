import type React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myAxiosInstance from '../axios/axios';
import axios from 'axios';
import type { IUser } from '../@types/User';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await myAxiosInstance.get(`/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
          setLoading(false);
        } catch (err: unknown) {
          if (axios.isAxiosError(err) && err.response) {
            setError(`Erreur API: ${err.response.data.message}`);
          } else {
            setError('Erreur inconnue');
          }
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setError('Identifiant de l\'utilisateur manquant.');
      setLoading(false);
    }
  }, [userId, token]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Utilisateur introuvable</div>;
  }

  return (
    <div className="user-profile">
      <h1>{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role.role_name}</p>
      <p>Status: {user.status.status_name}</p>
    </div>
  );
};

export default UserProfile;
