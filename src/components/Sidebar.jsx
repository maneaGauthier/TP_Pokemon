import React, { useState } from 'react';
import './Sidebar.scss';
import pokeball from '../assets/pokeball.png';

const Sidebar = ({ pokedex, setPokedex }) => {
  const [isOpen, setIsOpen] = useState(false);

  const removePokemon = (id) => {
    setPokedex(pokedex.filter(p => p.id !== id));
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <div className="icon-container">
           {isOpen ? (
             <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>X</span>
           ) : (
             <div className="closed-view">
                <img src={pokeball} alt="Pokédex" style={{ width: '30px' }} />
                <span>Pokédex ({pokedex.length})</span>
             </div>
           )}
        </div>
      </div>

      <div className="sidebar-content">
        <div className="logo-container">
           <img src={pokeball} alt="Pokédex Logo" />
        </div>

        <h2>Pokédex ({pokedex.length})</h2>
        
        {pokedex.length > 0 ? (
          <ul>
            {pokedex.map((p, index) => (
              <li key={index}>
                <span>{p.name}</span>
                <button 
                  className="remove-btn" 
                  onClick={() => removePokemon(p.id)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Votre Pokédex est vide</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;