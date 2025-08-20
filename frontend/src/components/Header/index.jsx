import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoSmall from '../../assets/images/mhara_logo.png';
import iconShoping from '../../assets/icons/shoping.png';
import iconUser from '../../assets/icons/user.png';
import DropdownMenu from '../DropdownMenu';

const Header = ({ onUploadPropertyClick, onContactClick, onHomeClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        if(onContactClick) {
            onContactClick();
        }
    }

    const handleHomeClick = (e) => {
        e.preventDefault();
        if(onHomeClick) {
            onHomeClick();
        }
    }

    return (
        <header className="header-glassmorphism">
        <div className="header-logo">
            <img src={logoSmall} alt="MHARA logo" className="logo-small" />
        </div>
        <nav className="navbar">
            <ul className="nav-links">
            <li><Link to="/home" onClick={handleHomeClick}>Home</Link></li>
            <li><Link to="/catalogo">Catalogo</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><a href="#" onClick={handleContactClick}>Contactanos</a></li>
            </ul>
        </nav>
        <div className="header-icons">
            <span><img src={iconShoping} alt="Icon Shoping" className='iconShoping'/></span>
            <span><img src={iconUser} alt="Icon User" className='iconUser'/></span>
            <span onClick={toggleMenu} style={{ cursor: 'pointer' }}>☰</span>
            {isMenuOpen && <DropdownMenu onUploadPropertyClick={onUploadPropertyClick} />}
        </div>
        </header>
    );
};

export default Header;