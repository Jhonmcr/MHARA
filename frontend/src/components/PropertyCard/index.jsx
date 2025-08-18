import React from 'react';

const PropertyCard = ({ property, onSelect }) => {
    return (
        <div className="sidebar-item" onClick={onSelect} style={{ cursor: 'pointer' }}>
        <img src={property.image || "https://via.placeholder.com/100x80"} alt={property.title} className="sidebar-image" />
        <div className="sidebar-info">
            <p>{property.title}</p>
            <p>{property.price} €</p>
        </div>
        </div>
    );
};

export default PropertyCard;
