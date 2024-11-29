import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Non Trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link to="/">
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
