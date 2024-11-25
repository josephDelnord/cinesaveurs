import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './App.css';
import Header from './components/Header/Header';
import Popular from './components/Popular/Popular';
import Recipes from './components/Recipes/Recipes';
import Recipe from './components/Recipe/Recipe';

function App() {
  const [showPopular, setShowPopular] = useState(true);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Recipes togglePopular={() => setShowPopular(!showPopular)} />
                {showPopular && <Popular isVisible={showPopular} />}
              </>
            }
          />
          <Route
            path="/recipe/:id"
            element={<Recipe />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
