// // src/components/Sidebar.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Sidebar: React.FC = () => {
//   const links = [
//     { to: '/admin/dashboard', text: 'Dashboard' },
//     { to: '/admin/dashboard/users', text: 'Users' },
//     { to: '/admin/dashboard/roles', text: 'Roles' },
//     { to: '/admin/dashboard/recipes', text: 'Recipes' },
//     { to: '/admin/dashboard/categories', text: 'Categories' },
//     { to: '/admin/dashboard/comments', text: 'Comments' },
//     { to: '/admin/dashboard/scores', text: 'Scores' },
//     { to: '/admin/dashboard/settings', text: 'Settings' },
//   ];

//   return (
//     <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', height: '100vh', padding: '20px' }}>
//       <h3>Admin Panel</h3>
//       <ul>
//         {links.map((link, index) => (
//           <li key={index}>
//             <Link to={link.to} style={{ color: 'white' }}>
//               {link.text}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
