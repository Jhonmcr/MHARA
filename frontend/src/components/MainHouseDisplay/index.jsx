import React from 'react';

const MainHouseDisplay = ({ property }) => {
    if (!property) {
        return (
            <div className="main-house-display">
            <p>Selecciona una propiedad de la lista para ver los detalles.</p>
            </div>
        );
    }

    return (
        <div className="main-house-display">
        <div className="house-image-wrapper">
            <img src={property.image || "https://via.placeholder.com/800x400"} alt={property.title} className="house-image" />
            <span className="code-tag">CÓDIGO: {property.code}</span>
        </div>
        <div className="house-details">
            <div className="details-text">
            <h3>{property.title}</h3>
            <p>{property.rooms} hab. | {property.bathrooms} baños | {property.area} m²</p>
            <p className="price">{property.price} €</p>
            </div>
            <div className="details-contact">
            <button className="contact-button">Contactar</button>
            </div>
        </div>
        </div>
    );
};

export default MainHouseDisplay;

