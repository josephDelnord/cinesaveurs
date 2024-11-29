import { Route, Routes } from 'react-router-dom';
import './styles/style.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Recipes from './Pages/Recipes';
import Recipe from './Pages/Recipe';
import Login from './Pages/Login';
import Register from './Pages/Register';
import About from './Pages/About';
import UserProfile from './Pages/UserProfile';
import AdminProfile from './Pages/AdminProfile';
import Dashboard from './Pages/Dashboard';
import NotFoundPage from './components/NotFoundPage';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Sidebar />

        <div className="main-content">
          <Header />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Recipes />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />

            {/* Route pour afficher une recette spécifique */}
            <Route path="/recipe/:id" element={<Recipe />} />

            {/* Routes de profil et administration */}
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/admin/profile/:userId" element={<AdminProfile />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />

            {/* Route de fallback pour les pages non trouvées */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
