import React from 'react';
import './Catalogo.css';
// Asegúrate de tener las imágenes en tu carpeta de assets
// import mainHouse from '../../assets/main-house.jpg';
// import macutoHouse from '../../assets/macuto-house.jpg';
// import caribeHouse from '../../assets/caribe-house.jpg';
// import maiquetiaHouse from '../../assets/maiquetia-house.jpg';

const Catalogo = () => {
    return (
        <div className="catalogo-container">
        <div className="catalogo-header">
            <div className="catalogo-header-left">
            <h1>MHARA ESTATE HOME</h1>
            <nav>
                <ul>
                <li><a href="#nosotros">Nosotros</a></li>
                <li><a href="#contactanos">Contactanos</a></li>
                <li><a href="#asesores">Asesores</a></li>
                </ul>
            </nav>
            </div>
            <div className="catalogo-header-right">
            <input type="text" placeholder="Filtros" className="search-input" />
            <button className="search-button">🔍</button>
            </div>
        </div>
        
        <div className="catalogo-main">
            {/* Sección principal de la casa */}
            <div className="main-house-display">
            <div className="house-image-wrapper">
                {/* <img src={mainHouse} alt="Casa principal" className="house-image" /> */}
                <div className="code-tag">Code: 00021</div>
            </div>
            <div className="house-details">
                <div className="details-text">
                <h3>Casa en los Corales</h3>
                <p>Habitaciones: 4  |  Baños: 5  |  Estacionamiento: 3  |  Piscina: 2  |  Mts2: 400</p>
                <p className="price">Precio: 2.000.200.00</p>
                </div>
                <div className="details-contact">
                <span className="contact-icon">👤</span>
                <button className="contact-button">Contactar</button>
                </div>
            </div>
            </div>

            {/* Sección de casas en la barra lateral */}
            <div className="sidebar">
            <div className="sidebar-item">
                {/* <img src={macutoHouse} alt="Casa Macuto" className="sidebar-image" /> */}
                <div className="sidebar-info">
                <span>Macuto</span>
                <span className="sidebar-arrow">→</span>
                </div>
            </div>
            <div className="sidebar-item">
                {/* <img src={caribeHouse} alt="Casa Caribe" className="sidebar-image" /> */}
                <div className="sidebar-info">
                <span>Caribe</span>
                <span className="sidebar-arrow">→</span>
                </div>
            </div>
            <div className="sidebar-item">
                {/* <img src={maiquetiaHouse} alt="Casa Maiquetia" className="sidebar-image" /> */}
                <div className="sidebar-info">
                <span>Maiquetia</span>
                <span className="sidebar-arrow">→</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Catalogo;