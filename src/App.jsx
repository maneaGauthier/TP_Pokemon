import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './css/normalize.css';
import './css/style.css';
import Root from './routes/root';
import Home from './pages/Home';
import DetailPokemon from './pages/DetailPokemon';
import MentionsLegales from './pages/MentionsLegales';
import Page404 from './pages/404';

function App() {
  const [pokedex, setPokedex] = useState([]);

  useEffect(() => {
    console.log(`Le Pokédex possède ${pokedex.length} Pokémons`);
  }, [pokedex]);

  return (
    <Routes>
        <Route path="/" element={<Root pokedex={pokedex} setPokedex={setPokedex} />}>
            <Route index element={<Home pokedex={pokedex} setPokedex={setPokedex} />} />
            <Route path="pokemon/:id" element={<DetailPokemon pokedex={pokedex} setPokedex={setPokedex} />} />
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="*" element={<Page404 />} />
        </Route>
    </Routes>
  );
}

export default App;