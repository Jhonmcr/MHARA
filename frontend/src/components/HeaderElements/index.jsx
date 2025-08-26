import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterIcon from '../FilterIcon';
import FilterModal from '../FilterModal';
import './HeaderElements.css';

const HeaderElements = ({ searchTerm, onSearchChange, onApplyFilters }) => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navLinks = [
        { path: '/home', label: 'Home' },
        { path: '/catalogo', label: 'Catalogo' },
        { path: '/nosotros', label: 'Nosotros' },
        { path: '/home', label: 'Contactanos', state: { scrollTo: 'contact' } },
        { path: '/asesores', label: 'Asesores' },
    ];

    const filteredLinks = navLinks.filter(link => {
        if (location.pathname === '/home') {
            return link.label !== 'Home';
        }
        return link.path !== location.pathname;
    });

    return (
        <header className="about-us-header">
            <div className="header-left">
                <h1><Link to="/home">MHARA ESTATE HOME |</Link></h1>
            </div>
            <nav className="header-right">
                <ul>
                    {filteredLinks.map(link => (
                        <li key={link.label}>
                            <Link to={link.path} state={link.state}>{link.label}</Link>
                        </li>
                    ))}
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
            />
        </header>
    );
};

export default HeaderElements;