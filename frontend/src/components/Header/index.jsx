import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Importar useAuth
import './Header.css';
import logoSmall from '../../assets/images/mhara_logo.png';
import iconShoping from '../../assets/icons/shoping.png';
import iconUser from '../../assets/icons/user.png';
import DropdownMenu from '../DropdownMenu';

const Header = ({ onUploadPropertyClick, onEditPropertyClick, onContactClick, onHomeClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

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
    
    const shouldShowMenu = user && (user.role === 'admin' || user.role === 'asesor');

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
            
            {shouldShowMenu && (
                <>
                    <span onClick={toggleMenu} style={{ cursor: 'pointer' }}>☰</span>
                    {isMenuOpen && <DropdownMenu 
                        onUploadPropertyClick={onUploadPropertyClick} 
                        onEditPropertyClick={onEditPropertyClick} 
                    />}
                </>
            )}
        </div>
        </header>
    );
};

export default Header;