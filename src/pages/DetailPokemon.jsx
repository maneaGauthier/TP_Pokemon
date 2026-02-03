import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CardPokemon from '../components/CardPokemon'; 
import Loader from '../components/Loader';
import './DetailPokemon.scss';

const DetailPokemon = ({ pokedex, setPokedex }) => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [family, setFamily] = useState([]);
  const [loadingFamily, setLoadingFamily] = useState(true);

  useEffect(() => {
    setPokemon(null);
    setFamily([]);
    setLoadingFamily(true);

    const fetchData = async () => {
      try {
        const response = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${id}`);
        const currentData = await response.json();
        setPokemon(currentData);

        try {
          const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          const speciesData = await speciesResponse.json();
          
          const chainResponse = await fetch(speciesData.evolution_chain.url);
          const chainData = await chainResponse.json();

          const familyIds = [];
          const traverseChain = (node) => {
             const urlParts = node.species.url.split('/');
             const pokemonId = urlParts[urlParts.length - 2];
             familyIds.push(pokemonId);

             if (node.evolves_to.length > 0) {
               node.evolves_to.forEach(child => traverseChain(child));
             }
          };
          
          traverseChain(chainData.chain);

          const familyPromises = familyIds.map(familyId => 
             fetch(`https://pokebuildapi.fr/api/v1/pokemon/${familyId}`)
             .then(res => res.json())
             .catch(() => null)
          );

          const familyFullData = await Promise.all(familyPromises);
          
          const validFamily = familyFullData
             .filter(p => p !== null)
             .sort((a, b) => a.id - b.id);

          setFamily(validFamily);
          setLoadingFamily(false);

        } catch (err) {
           console.error("Erreur PokeAPI :", err);
           setLoadingFamily(false);
        }

      } catch (err) {
        console.error("Erreur Pokebuild :", err);
        setLoadingFamily(false);
      }
    };

    fetchData();
  }, [id]);

  if (!pokemon) return <Loader />;

  return (
    <div className="detail-container">
       
       <div className="navigation">
          <Link to="/" className="btn-return">
             ← Retour à l'accueil
          </Link>
       </div>

       <div className="content-wrapper">
           <div className="main-card">
              <CardPokemon 
                  pokemon={pokemon} 
                  pokedex={pokedex} 
                  setPokedex={setPokedex} 
              />
           </div>

           <div className="evolutions-section">
              <h3>Famille d'évolution</h3>
              
              {loadingFamily ? (
                 <p style={{color: 'white'}}>Chargement de la famille...</p>
              ) : (
                <div className="evolution-list">
                   {family.length > 0 ? (
                      family.map((member) => (
                        <Link 
                          key={member.id} 
                          to={`/pokemon/${member.id}`} 
                          className={`evo-item ${member.id === pokemon.id ? 'current' : ''}`}
                        >
                           <div className="evo-img-wrapper">
                              <img 
                                  src={member.image} 
                                  alt={member.name} 
                              />
                           </div>
                           <span>{member.name}</span>
                        </Link>
                      ))
                   ) : (
                     <p style={{color: 'white'}}>Aucune évolution trouvée.</p>
                   )}
                </div>
              )}
           </div>
       </div>
    </div>
  );
};

export default DetailPokemon;