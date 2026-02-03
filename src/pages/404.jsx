import React from 'react';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page non trouvée</h1>
      <p>Oups ! Ce Pokémon s'est enfui.</p>
      <Link to="/" style={{ color: '#ffcc01' }}>Retourner à l'accueil</Link>
    </div>
  );
};

export default Page404;