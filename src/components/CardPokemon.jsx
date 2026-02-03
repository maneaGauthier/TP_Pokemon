import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import pokemonBack from '../assets/pokemonBack.png'; 
import iconAdd from '../assets/add.png'; 
import './CardPokemon.scss';

function CardPokemon({ pokemon, pokedex, setPokedex }) {
  const [isOpen, setIsOpen] = useState(false);

  const getColorHexa = (type) => {
    const colors = {
      'Eau': 'blue',
      'Plante': 'green',
      'Poison': '#D850C2',
      'Vol': '#738DDB',
      'Feu': 'orange',
      'Insecte': '#70B901',
      'Électrik': '#FFD244',
      'Sol': '#CD793F',
      'Fée': 'pink',
      'Combat': 'darkred',
      'Psy': '#FD6960',
      'Acier': '#246A79',
      'Glace': '#67D1C8',
      'Roche': '#CBB866',
      'Dragon': '#1C6ABB'
    };
    return colors[type] || 'grey';
  };

  const primaryType = pokemon.apiTypes ? pokemon.apiTypes[0].name : 'Normal';
  const color = getColorHexa(primaryType);

  const handleAddToPokedex = (e) => {
    e.stopPropagation();
    
    if (pokedex.some(p => p.id === pokemon.id)) {
        return;
    }

    setPokedex([...pokedex, { id: pokemon.id, name: pokemon.name }]);
  };

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <article className="card-pokemon" onClick={toggleCard}>
      <div className="card-inner" data-reverse={isOpen}>
        
        <div 
            className="card-front" 
            style={{ borderColor: color, backgroundColor: color }}
        >
            <span className="addToPokedex" onClick={handleAddToPokedex}>
                <img src={iconAdd} alt="Ajouter" />
            </span>

            <figure>
               <picture>
                  <img src={pokemon.image} alt={pokemon.name} />
               </picture>
               
               <figcaption>
                  <div className="types">
                    {pokemon.apiTypes && pokemon.apiTypes.map((type, index) => (
                      <img 
                        key={index} 
                        src={type.image} 
                        alt={type.name} 
                        title={type.name} 
                      />
                    ))}
                  </div>

                  <h2>{pokemon.name}</h2>
                  
                  <div style={{ textAlign: 'center', margin: '5px 0' }}>
                    <Link 
                        to={`/pokemon/${pokemon.id}`} 
                        onClick={handleLinkClick}
                        style={{ 
                            color: '#000', 
                            fontWeight: 'bold', 
                            textDecoration: 'underline',
                            position: 'relative',
                            zIndex: 20
                        }}
                    >
                        Voir détails
                    </Link>
                  </div>

                  <ol>
                    <li>Points de vie : {pokemon.stats.HP}</li>
                    <li>Attaque : {pokemon.stats.attack}</li>
                    <li>Défense : {pokemon.stats.defense}</li>
                    <li>Attaque spécial : {pokemon.stats.special_attack}</li>
                    <li>Vitesse : {pokemon.stats.speed}</li>
                  </ol>
               </figcaption>
            </figure>
        </div>

        <div className="card-back">
          <img src={pokemonBack} alt="Dos de la carte" />
        </div>

      </div>
    </article>
  );
}

export default CardPokemon;