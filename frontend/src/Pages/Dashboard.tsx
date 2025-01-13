import type React from "react";
import { useEffect, useState } from "react";
import myAxiosInstance from "../axios/axios";
import type { IComment } from "../@types/Comment";
import type { IScore } from "../@types/Score";
import type { IUser } from "../@types/User";
import { NavLink } from "react-router-dom";
import Loading from "../components/Loading";

const Dashboard: React.FC = () => {
  const [comments, setComments] = useState<IComment[]>([]); // Définition de l'état pour les commentaires
  const [scores, setScores] = useState<IScore[]>([]); // Définition de l'état pour les scores
  const [users, setUsers] = useState<IUser[]>([]); // État pour les utilisateurs
  const [loading, setLoading] = useState<boolean>(true); // Ajout de l'état de chargement

  const loadData = () => {
    setLoading(true); // Démarre le chargement

    // Charger les commentaires
    const loadComments = () => {
      const cachedComments = localStorage.getItem("comments");
      if (cachedComments) {
        setComments(JSON.parse(cachedComments)); // Charger depuis le cache
        setLoading(false); // Fin du chargement
      } else {
        myAxiosInstance
          .get<IComment[]>("/api/comments")
          .then((response) => {
            setComments(response.data);
            localStorage.setItem("comments", JSON.stringify(response.data)); // Sauvegarder dans le cache
            setLoading(false); // Fin du chargement
          })
          .catch((error) => {
            console.error("Erreur de récupération des commentaires", error);
            setLoading(false); // Fin du chargement
          });
      }
    };

    // Charger les scores
    const loadScores = () => {
      const cachedScores = localStorage.getItem("scores");
      if (cachedScores) {
        setScores(JSON.parse(cachedScores)); // Charger depuis le cache
        setLoading(false); // Fin du chargement
      } else {
        myAxiosInstance
          .get<IScore[]>("/api/scores")
          .then((response) => {
            setScores(response.data); // Mettre à jour l'état des scores avec les données de la réponse
            localStorage.setItem("scores", JSON.stringify(response.data)); // Sauvegarder dans le cache
            setLoading(false); // Fin du chargement
          })
          .catch((error) => {
            console.error("Erreur de récupération des scores", error);
            setLoading(false); // Fin du chargement
          });
      }
    };

    // Charger les utilisateurs
    const loadUsers = () => {
      const cachedUsers = localStorage.getItem("users");
      if (cachedUsers) {
        setUsers(JSON.parse(cachedUsers)); // Charger depuis le cache
        setLoading(false); // Fin du chargement
      } else {
        myAxiosInstance
          .get<IUser[]>("/api/users")
          .then((response) => {
            const activeUsers = response.data.filter((user) => {
              // Vérifier que user.status existe avant d'accéder à status_name
              return user.status && user.status.status_name === "active";
            });
            console.log(response.data); // Vérifie ce que tu reçois
            setUsers(activeUsers);
            localStorage.setItem("users", JSON.stringify(activeUsers)); // Sauvegarder dans le cache
            setLoading(false); // Fin du chargement
          })
          .catch((error) => {
            console.error("Erreur de récupération des utilisateurs:", error);
            setLoading(false); // Fin du chargement en cas d'erreur
          });
      }
    };

    loadComments();
    loadScores();
    loadUsers();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadData(); // Charger les données au montage du composant
  }, []); // Effet exécuté au montage du composant

  const links = [
    { id: "users", to: "/admin/dashboard/users", text: "Users" },
    { id: "roles", to: "/admin/dashboard/roles", text: "Roles" },
    { id: "recipes", to: "/admin/dashboard/recipes", text: "Recipes" },
    { id: "categories", to: "/admin/dashboard/categories", text: "Categories" },
    { id: "comments", to: "/admin/dashboard/comments", text: "Comments" },
    { id: "scores", to: "/admin/dashboard/scores", text: "Scores" },
    { id: "settings", to: "/admin/dashboard/settings", text: "Settings" },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <div className="nav-container">
        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
        </header>
        <main className="dashboard-main">
          <div className="dashboard-grid">
            {links.map((link) => (
              <div key={link.id} className="dashboard-card">
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.text}
                </NavLink>
              </div>
            ))}
          </div>
        </main>
      </div>
      <div className="dashboard-content">
        <div className="users-section">
          <h3 className="dashboard-subtitle">Utilisateurs actifs</h3>
          {loading ? (
            <p>Chargement des utilisateurs...</p>
          ) : users.length > 0 ? (
            <ul className="users-list">
              {users.map((user) => (
                <li key={user._id} className="user-item">
                  <p>Nom d'utilisateur: {user.username}</p>
                  <small>
                    Statut: {user.status?.status_name || "Non défini"}
                  </small>
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
                  <small className="comment-user">
                    Posté par: {comment.user.username || "Utilisateur inconnu"}
                  </small>
                  <small className="comment-recipe">
                    Sur la recette: {comment.recipe.title || "Non trouvée"}
                  </small>
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
                  <small className="score-user">
                    Note donnée par:{" "}
                    {score.user.username || "Utilisateur inconnu"}
                  </small>
                  <small className="score-recipe">
                    Note donnée à la recette:{" "}
                    {score.recipe.title || "Non trouvée"}
                  </small>
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
