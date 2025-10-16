import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterIcon from '../FilterIcon';
import FilterModal from '../FilterModal';
import { useAuth } from '../../context/AuthContext';
import './HeaderElements.css';

const HeaderElements = ({ searchTerm, onSearchChange, onApplyFilters, onClearFilters }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const allLinks = [
        { path: '/home', label: 'Home', protected: true },
        { path: '/catalogo', label: 'Catalogo', protected: false },
        { path: '/nosotros', label: 'Nosotros', protected: true },
        { path: '/home', label: 'Contactanos', state: { scrollTo: 'contact' }, protected: true },
        { path: '/asesores', label: 'Asesores', protected: false },
    ];

    const navLinks = allLinks.filter(link => {
        if (!user && link.protected) {
            return false; // No mostrar enlaces protegidos si no hay usuario
        }
        if (location.pathname === '/home' && link.label === 'Home') {
            return false; // No mostrar 'Home' si ya estamos en home
        }
        if (link.path === location.pathname && !link.state) {
            return false; // No mostrar el enlace de la página actual
        }
        return true;
    });

    const handleClearAndClose = () => {
        onClearFilters();
        // No cerramos el modal para que el usuario vea que se limpió.
        // Opcional: podrías cerrarlo si prefieres:
        // setIsModalOpen(false);
    };

    return (
        <header className="about-us-header">
            <div className="header-left">
                <h1><Link to={user ? "/home" : "/catalogo"}>MHARA ESTATE HOME |</Link></h1>
            </div>
            <nav className="header-right">
                <ul>
                    {navLinks.map(link => (
                        <li key={link.label}>
                            <Link to={link.path} state={link.state}>{link.label}</Link>
                        </li>
                    ))}
                    {!user && (
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                </ul>
                {location.pathname === '/catalogo' && (
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <button className="filter-button" onClick={() => setIsModalOpen(true)}>
                            <FilterIcon />
                        </button>
                    </div>
                )}
            </nav>
            <FilterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApplyFilters={onApplyFilters}
                onClearFilters={handleClearAndClose}
            />
        </header>
    );
};

export default HeaderElements;