import React, { useState, useEffect } from 'react';
import CardPokemon from '../components/CardPokemon'; 
import Loader from '../components/Loader'; 

const Home = ({ pokedex, setPokedex }) => {
  const [dataPokemon, setDataPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokebuildapi.fr/api/v1/pokemon/generation/1')
      .then((response) => response.json())
      .then((data) => {
        setDataPokemon(data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);


  if (isLoading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {dataPokemon.map((pokemon) => (
        <CardPokemon 
          key={pokemon.id} 
          pokemon={pokemon}
          pokedex={pokedex}
          setPokedex={setPokedex}
        />
      ))}
    </div>
  );
};

export default Home;