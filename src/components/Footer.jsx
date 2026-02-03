import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
  return (
    <footer>
       <Link to="/mentions-legales">Mentions légales</Link>
    </footer>
  );
}

export default Footer;