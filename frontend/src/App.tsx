import { Route, Routes } from 'react-router-dom';
import './styles/style.scss';

import Header from './components/Header';
import Footer from "./components/Footer";
import Recipes from './Pages/Recipes';
import Recipe from './Pages/Recipe';
import Login from './Pages/Login';
import Register from './Pages/Register';
// import Dashboard from './Pages/Dashboard';
import About from "./Pages/About";
// import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <div className="app">
      {/* En-tête */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
        <Route path="/about" element={<About />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
