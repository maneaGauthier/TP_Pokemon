import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import logoPokemon from '../assets/logo.png';

export default function Root({ pokedex, setPokedex }) {
  return (
    <>
      <Sidebar pokedex={pokedex} setPokedex={setPokedex} />
      
      <header>
        <h1 style={{ textAlign: 'center' }}>
           <Link to="/">
             <img src={logoPokemon} alt="Logo Pokémon" className="logo" />
           </Link>
        </h1>
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}