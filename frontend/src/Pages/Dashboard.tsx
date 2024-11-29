import React, { useEffect, useState } from 'react';
import myAxiosInstance from '../axios/axios';
import type { IComment } from '../@types/Comment';
import type { IScore } from '../@types/Score';
import type { IUser } from '../@types/User';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const [comments, setComments] = useState<IComment[]>([]);  // Définition de l'état pour les commentaires
  const [scores, setScores] = useState<IScore[]>([]);        // Définition de l'état pour les scores
  const [users, setUsers] = useState<IUser[]>([]);            // État pour les utilisateurs
  const [loading, setLoading] = useState<boolean>(true);      // Ajout de l'état de chargement
  
  useEffect(() => {
    // Exemple d'appel API pour récupérer des commentaires
    myAxiosInstance.get<IComment[]>('/api/comments')
      .then(response => {
        setComments(response.data); // On affecte les commentaires à l'état
      })
      .catch(error => {
        console.error('Erreur de récupération des commentaires', error);
      });

    // Exemple d'appel API pour récupérer des scores
    myAxiosInstance.get<IScore[]>('/api/scores')
      .then(response => {
        setScores(response.data); // On affecte les scores à l'état
      })
      .catch(error => {
        console.error('Erreur de récupération des scores', error);
      });

    // Exemple d'appel API pour récupérer le statut
    myAxiosInstance.get<IUser[]>('/api/users')  // Assurez-vous que votre API retourne une liste d'utilisateurs
    .then(response => {
      // Filtrer les utilisateurs ayant le statut "actif"
      const activeUsers = response.data.filter(user => user.status.status_name === 'active');
      setUsers(activeUsers); // Mettre à jour l'état avec les utilisateurs actifs
      setLoading(false); // Fin du chargement
    })
    .catch(error => {
      console.error('Erreur de récupération des utilisateurs:', error);
      setLoading(false); // Fin du chargement en cas d'erreur
    });
}, []);  // Effet exécuté au montage du composant

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="users-section">
          <h3 className="dashboard-subtitle">Utilisateurs Actifs</h3>
          {loading ? (
            <p>Chargement des utilisateurs...</p>
          ) : users.length > 0 ? (
            <ul className="users-list">
              {users.map((user) => (
                <li key={user._id} className="user-item">
                  <p>Nom d'utilisateur: {user.username}</p>
                  <small>Statut: {user.status.status_name}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun utilisateur actif trouvé.</p>
          )}
        </div>

        <div className="comments-section">
          <h3 className="dashboard-subtitle">Commentaires</h3>
          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map((comment) => (
                <li key={comment._id} className="comment-item">
                  <p>{comment.content}</p>
                  <small className="comment-user">Posté par: {comment.user.username}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Pas de commentaires disponibles.</p>
          )}
        </div>

        <div className="scores-section">
          <h3 className="dashboard-subtitle">Scores</h3>
          {scores.length > 0 ? (
            <ul className="scores-list">
              {scores.map((score) => (
                <li key={score._id} className="score-item">
                  <p>Score: {score.score}</p>
                  <small className="score-user">Note donnée par: {score.user.username}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Pas de scores disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
