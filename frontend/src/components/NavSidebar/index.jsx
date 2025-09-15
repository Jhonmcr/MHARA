import React from 'react';
import { Link } from 'react-router-dom';
import './NavSidebar.css';

const NavSidebar = ({ isOpen, onClose, onNavigate }) => {
    if (!isOpen) {
        return null;
    }

    const handleLinkClick = (path) => {
        onNavigate(path);
        onClose();
    };

    return (
        <>
            <div className="nav-sidebar-overlay" onClick={onClose}></div>
            <div className="nav-sidebar">
                <button className="nav-sidebar-close" onClick={onClose}>&times;</button>
                <ul className="nav-sidebar-links">
                    <li><Link to="/home" onClick={() => handleLinkClick('/home')}>Home</Link></li>
                    <li><Link to="/catalogo" onClick={() => handleLinkClick('/catalogo')}>Catalogo</Link></li>
                    <li><Link to="/nosotros" onClick={() => handleLinkClick('/nosotros')}>Nosotros</Link></li>
                    <li><a href="#" onClick={() => handleLinkClick('/contactanos')}>Contactanos</a></li>
                </ul>
                {/* User actions can be added here later */}
            </div>
        </>
    );
};

export default NavSidebar;
