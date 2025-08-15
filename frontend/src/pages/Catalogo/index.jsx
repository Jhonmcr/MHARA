import React from 'react';
import './Catalogo.css';
import { Link } from 'react-router-dom';
import HeaderElements from '../../components/HeaderElements';

const Catalogo = () => {
    return (
        <div className="catalogo-container">
            <HeaderElements/>
            <div className="catalogo-main">
                <div className="main-house-display">
                    {/* ... contenido ... */}
                </div>
                <div className='main-price-display'>

                </div>
                <div className="sidebar">
                    {/* ... contenido ... */}
                </div>
            </div>
        </div>
    );
};

export default Catalogo;