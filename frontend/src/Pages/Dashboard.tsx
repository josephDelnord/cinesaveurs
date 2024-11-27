// // src/components/Dashboard.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/DashboardSidebar';
// import Header from '../components/DashboardHeader';

// const Dashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   if (!token) {
//     navigate('/login');  // Redirige vers la page de login si l'utilisateur n'est pas authentifié
//     return null; // On peut aussi afficher un message "Chargement..." ou similaire ici.
//   }
//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar />
//       <div style={{ flex: 1 }}>
//         <Header />
//         <div className="dashboard-content">
//           <h2>Dashboard</h2>
//           <p>Bienvenue dans le dashboard</p>
//           {/* On peut ajouter plus de contenu comme des graphiques, des statistiques, etc. */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
