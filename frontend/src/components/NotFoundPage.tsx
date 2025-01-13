// src/components/NotFoundPage.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageNotFound } from "../slices/errorSlice";
import type { RootState } from "../store";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const dispatch = useDispatch();
  const isPageNotFound = useSelector((state: RootState) => state.error.isPageNotFound);

  // Lorsque le composant est monté, on définit que la page n'a pas été trouvée
  useEffect(() => {
    dispatch(setPageNotFound(true));

    // Optionnellement, on peut réinitialiser l'état après un certain délai ou une autre action
    return () => {
      dispatch(setPageNotFound(false));
    };
  }, [dispatch]);

  return (
    <div className="not-found-container">
      <h1>404 - Page Non Trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link to="/">Retourner à l'accueil</Link>

      {isPageNotFound && (
        <div className="error-message">
          <p>Erreur 404: La page demandée n'a pas été trouvée.</p>
        </div>
      )}
    </div>
  );
};

export default NotFoundPage;
