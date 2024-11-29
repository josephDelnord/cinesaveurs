import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // Vérifier le rôle de l'utilisateur au chargement et lors de la déconnexion
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []); // Ne se déclenche qu'une seule fois, au chargement

  // Si le rôle n'est pas admin ou si l'utilisateur n'est pas connecté, ne pas afficher le Sidebar
  if (userRole !== 'admin') {
    return null;
  }

  const links = [
    { to: '/admin/dashboard', text: 'Dashboard' },
    { to: '/admin/dashboard/users', text: 'Users' },
    { to: '/admin/dashboard/roles', text: 'Roles' },
    { to: '/admin/dashboard/recipes', text: 'Recipes' },
    { to: '/admin/dashboard/categories', text: 'Categories' },
    { to: '/admin/dashboard/comments', text: 'Comments' },
    { to: '/admin/dashboard/scores', text: 'Scores' },
    { to: '/admin/dashboard/settings', text: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
