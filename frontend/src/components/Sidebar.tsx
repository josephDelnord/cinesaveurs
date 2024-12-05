import type React from 'react';
import { useEffect, useState } from 'react';
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
    { id: 'dashboard', to: '/admin/dashboard', text: 'Dashboard' },
    { id: 'users', to: '/admin/dashboard/users', text: 'Users' },
    { id: 'roles', to: '/admin/dashboard/roles', text: 'Roles' },
    { id: 'recipes', to: '/admin/dashboard/recipes', text: 'Recipes' },
    { id: 'categories', to: '/admin/dashboard/categories', text: 'Categories' },
    { id: 'comments', to: '/admin/dashboard/comments', text: 'Comments' },
    { id: 'scores', to: '/admin/dashboard/scores', text: 'Scores' },
    { id: 'settings', to: '/admin/dashboard/settings', text: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
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
