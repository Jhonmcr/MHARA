import React from 'react';
import './Catalogo.css';
import { Link } from 'react-router-dom';
// ... importaciones de imágenes

const Catalogo = () => {
    return (
        <div className="catalogo-container">
            <header className="catalogo-header">
                <div className="catalogo-header-left">
                    <h1><Link to="/">MHARA ESTATE HOME</Link></h1>
                    <nav>
                        <ul>
                            <li><Link to="/nosotros">Nosotros</Link></li>
                            <li><Link to="/contactanos">Contactanos</Link></li>
                            <li><Link to="/asesores">Asesores</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="catalogo-header-right">
                    <input type="text" placeholder="Filtros" className="search-input" />
                    <button className="search-button">🔍</button>
                </div>
            </header>
            <div className="catalogo-main">
                {/* Sección principal de la casa */}
                <div className="main-house-display">
                    {/* ... contenido ... */}
                </div>
                {/* Sección de casas en la barra lateral */}
                <div className="sidebar">
                    {/* ... contenido ... */}
                </div>
            </div>
        </div>
    );
};

export default Catalogo;