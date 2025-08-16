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
                    <div className="house-image-wrapper">
                        <img src="https://via.placeholder.com/800x400" alt="Casa en venta" className="house-image" />
                        <span className="code-tag">CÓDIGO: 12345</span>
                    </div>
                    <div className="house-details">
                        <div className="details-text">
                            <h3>Chalet en urbanización privada</h3>
                            <p>4 hab. | 3 baños | 250 m²</p>
                            <p className="price">650.000 €</p>
                        </div>
                        <div className="details-contact">
                            <button className="contact-button">Contactar</button>
                        </div>
                    </div>
                </div>
                <div className="sidebar">
                    <div className="sidebar-item">
                        <img src="https://via.placeholder.com/100x80" alt="Casa pequeña" className="sidebar-image" />
                        <div className="sidebar-info">
                            <p>Chalet adosado</p>
                            <p>320.000 €</p>
                        </div>
                    </div>
                    <div className="sidebar-item">
                        <img src="https://via.placeholder.com/100x80" alt="Casa pequeña" className="sidebar-image" />
                        <div className="sidebar-info">
                            <p>Piso céntrico</p>
                            <p>180.000 €</p>
                        </div>
                    </div>
                    <div className="sidebar-item">
                        <img src="https://via.placeholder.com/100x80" alt="Casa pequeña" className="sidebar-image" />
                        <div className="sidebar-info">
                            <p>Ático con terraza</p>
                            <p>450.000 €</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catalogo;