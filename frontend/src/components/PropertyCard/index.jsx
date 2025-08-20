import React from 'react';
import styles from './PropertyCard.module.css';

const PropertyCard = ({ property, onSelect }) => {
    return (
        <div className={styles.propertyCard} onClick={onSelect}>
            <img src={property.image_url || "https://via.placeholder.com/100x80"} alt={property.property_type} className={styles.propertyImage} />
            <div className={styles.propertyInfo}>
                <h4>{property.property_type}</h4>
                <p>{property.address}</p>
            </div>
        </div>
    );
};

export default PropertyCard;
