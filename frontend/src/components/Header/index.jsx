import React from 'react';
import './Header.css';
import logoSmall from '../../assets/images/mhara_logo.png';

const Header = () => {
    return (
        <header className="header-glassmorphism">
            <div className="header-logo">
                <img src={logoSmall} alt="MHARA logo" className="logo-small" />
            </div>
            <nav className="navbar">
                <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#catalogo">Catalogo</a></li>
                <li><a href="#nosotros">nosotros</a></li>
                <li><a href="#contactanos">contactanos</a></li>
                </ul>
            </nav>
            <div className="header-icons">
                <span>👜</span>
                <span>👤</span>
                <span>☰</span>
            </div>
        </header>
    );
};

export default Header;