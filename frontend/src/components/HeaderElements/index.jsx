import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterIcon from '../FilterIcon';
import FilterModal from '../FilterModal';
import './HeaderElements.css';

const HeaderElements = ({ searchTerm, onSearchChange, onApplyFilters, onClearFilters, isGuest }) => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Definir los enlaces disponibles para todos y solo para usuarios autenticados
    const publicLinks = [
        { path: '/nosotros', label: 'Nosotros' },
    ];
    const privateLinks = [
        { path: '/home', label: 'Home' },
        { path: '/catalogo', label: 'Catalogo' },
        { path: '/home', label: 'Contactanos', state: { scrollTo: 'contact' } },
        { path: '/asesores', label: 'Asesores' },
    ];

    // Combinar enlaces según el estado de autenticación
    const navLinks = isGuest ? publicLinks : [...publicLinks, ...privateLinks];

    const filteredLinks = navLinks.filter(link => {
        // No filtrar si es un invitado, ya que los enlaces son limitados
        if (isGuest) return true;
        
        // Lógica de filtrado para usuarios autenticados
        if (location.pathname === '/home') {
            return link.label !== 'Home';
        }
        return link.path !== location.pathname;
    });

    const handleClearAndClose = () => {
        onClearFilters();
    };

    return (
        <header className="about-us-header">
            <div className="header-left">
                {isGuest ? (
                    <h1>MHARA ESTATE HOME |</h1>
                ) : (
                    <h1><Link to="/home">MHARA ESTATE HOME |</Link></h1>
                )}
            </div>
            <nav className="header-right">
                <ul>
                    {filteredLinks.map(link => (
                        <li key={link.label}>
                            <Link to={link.path} state={link.state}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
                {location.pathname.startsWith('/catalogo') && !isGuest && (
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            disabled={isGuest}
                        />
                        <button className="filter-button" onClick={() => setIsModalOpen(true)} disabled={isGuest}>
                            <FilterIcon />
                        </button>
                    </div>
                )}
            </nav>
            {!isGuest && (
                <FilterModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onApplyFilters={onApplyFilters}
                    onClearFilters={handleClearAndClose}
                />
            )}
        </header>
    );
};

export default HeaderElements;
