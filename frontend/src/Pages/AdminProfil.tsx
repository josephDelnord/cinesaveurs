import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import myAxiosInstance from "../axios/axios";
import type { IUser } from "../@types/User";
import Loading from "../components/Loading";
import { setUser, setLoading, setError } from "../slices/userInfosSlice"; // Actions du Redux store
import {
  getTokenAndPseudoFromLocalStorage,
  isTokenValid,
  decodeToken,
} from "../localstorage/localstorage"; // Utilitaires pour gérer le token

const AdminProfile: React.FC = () => {
  const dispatch = useDispatch();

  // Récupérer l'état depuis le Redux Store
  const { user, loading, error } = useSelector(
    (state: {
      userInfos: {
        user: IUser | null;
        loading: boolean;
        error: string | null;
      };
    }) => state.userInfos
  );

  const tokenInfo = getTokenAndPseudoFromLocalStorage();

  // Fonction pour récupérer les informations de l'admin
  const fetchData = () => {
    if (!tokenInfo) {
      dispatch(
        setError("Veuillez vous connecter pour accéder à votre profil.")
      );
      return;
    }
    const { token, userId } = tokenInfo;

    // Vérifie si le token est valide avant de récupérer les données
    if (!isTokenValid(token)) {
      dispatch(setError("Token invalide ou expiré"));
      return;
    }

    dispatch(setLoading(true)); // Début de la récupération des données

    // Vérification du token et récupération des informations de l'admin
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      dispatch(setError("Token invalide"));
      dispatch(setLoading(false));
      return;
    }

    // Vérifie que l'utilisateur connecté a un rôle d'admin
    if (decodedToken.role !== "admin") {
      dispatch(setError("Accès réservé aux administrateurs"));
      dispatch(setLoading(false));
      return;
    }

    // Récupère les informations de l'admin depuis l'API
    myAxiosInstance
      .get<IUser>(`/api/admins/${userId}`, {
        // Appel à la route spécifique pour l'admin
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Réponse de l'API:", response.data);
        dispatch(setUser(response.data)); // Sauvegarder les données dans Redux store
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de l'admin", err);
        dispatch(setError("Erreur lors de la récupération de l'admin"));
      })
      .finally(() => {
        dispatch(setLoading(false)); // Fin de la récupération des données
      });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Réinitialiser l'état avant de faire un nouvel appel
    if (!user && !loading) {
      console.log("Lancement de la récupération des données...");
      fetchData(); // Lancer la récupération des données à l'initialisation
    } else {
      console.log(
        "Les données sont déjà chargées ou en train de se charger..."
      );
    }
  }, [user, loading]);

  // Si l'utilisateur n'est pas connecté
  if (!tokenInfo) {
    return <div>Veuillez vous connecter pour accéder à votre profil.</div>;
  }

  // Si l'utilisateur est en train de charger
  if (loading) {
    return <Loading />;
  }

  // Si une erreur est survenue
  if (error) {
    return <div>{error}</div>;
  }

  // Si l'admin n'est pas trouvé
  if (!user) {
    return <div>Administrateur introuvable</div>;
  }

  return (
    <div className="admin-profile">
      <h1>{user.username}</h1>
      <div className="admin-profile__info">
        <p className="admin-profile__email">
          <strong>Email :</strong> <span>{user.email}</span>
        </p>
        <p className="admin-profile__role">
          <strong>Rôle :</strong> <span>{user.role?.role_name}</span>
        </p>
        <p className="admin-profile__status">
          <strong>Statut :</strong> <span>{user.status?.status_name}</span>
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;
