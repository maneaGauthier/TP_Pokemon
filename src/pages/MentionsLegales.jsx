import React from 'react';
import { Link } from 'react-router-dom';

const MentionsLegales = () => {
  return (
    <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
      <h2>Mentions Légales</h2>
      <p>Ceci est un projet pédagogique pour apprendre React.</p>
      <div style={{ marginTop: '20px' }}>
        <Link 
            to="/" 
            style={{ 
                color: '#333', 
                backgroundColor: '#ffcc01', 
                padding: '10px 20px', 
                borderRadius: '5px', 
                textDecoration: 'none', 
                fontWeight: 'bold' 
            }}
        >
            Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default MentionsLegales;