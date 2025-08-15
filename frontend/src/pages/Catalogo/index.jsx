import React from 'react';
import './Catalogo.css';
import { Link } from 'react-router-dom';
import HeaderElements from '../../components/HeaderElements';

const Catalogo = () => {
    return (
        <div className="catalogo-container">
            <HeaderElements/>
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