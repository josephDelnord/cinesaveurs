import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Popular from './components/Popular/Popular';
import Recipes from './components/Recipes/Recipes';
import React from 'react';


function App() {
  const [showPopular, setShowPopular] = useState(true);

  return (
    <div className="app">
      <Header />
      <Recipes togglePopular={() => setShowPopular(!showPopular)} />
      {showPopular && <Popular isVisible={showPopular} />
}
    </div>
  );
}

export default App;
