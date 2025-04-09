import React from 'react';
import './Navbar.css';
import logo from '../assets/PuffinAiLogo.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="PuffinAI Logo" className="logo" />
        <span className="brand">
          Puffin<span className="highlight">AI</span>
        </span>
      </div>

      <div className="nav-right">
        <a href="#section1">Home</a>
        <a href="#section2">Why</a>
        <Link to="/pollen">Pollen</Link>


        <a href="#section4">Scan</a>
        <a href="#section5">Tips</a>
      </div>
    </nav>
  );
};

export default Navbar;
