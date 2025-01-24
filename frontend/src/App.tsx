import { Route, Routes } from "react-router-dom";
import "./styles/style.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Sidebar from './components/Sidebar';
import Recipes from "./Pages/Recipes";
import Recipe from "./Pages/Recipe";
import AddRecipe from "./Pages/addRecipe";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import UserManagement from "./Pages/UserManagement";
import NotFoundPage from "./components/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";
import RequireAdmin from "./components/RequireAdmin";
import UserProfile from "./Pages/UserProfile";  // Profil de l'utilisateur
import AdminProfil from "./Pages/AdminProfil"; // Profil de l'administrateur

function App() {
  return (
    <AuthProvider>
      <div>
        {/* <Sidebar/> */}
        <div className="main-content">
          <Header />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Recipes />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/recipe/:id" element={<Recipe />} />
            <Route path="/add-recipe" element={<AddRecipe />} />

            {/* Routes pour les pages protégées */}
            <Route
              path="/admin/dashboard"
              element={
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/dashboard/users"
              element={
                <RequireAdmin>
                  <UserManagement />
                </RequireAdmin>
              }
            />
            <Route path="/admin/profile"
            element={
              <RequireAdmin>
                <AdminProfil />
              </RequireAdmin>
            }
            />

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
