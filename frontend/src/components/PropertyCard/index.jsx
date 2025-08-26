import React from 'react';
import styles from './PropertyCard.module.css';

const PropertyCard = ({ property, onSelect }) => {
    const imageUrl = property.photos && property.photos.length > 0
        ? property.photos[0]
        : "https://via.placeholder.com/100x80";

    return (
        <div className={styles.propertyCard} onClick={() => onSelect(property)}>
            <img src={imageUrl} alt={property.shortAddress} className={styles.propertyImage} />
            <div className={styles.propertyInfo}>
                <div className={styles.infoLine}>
                    <p className={styles.address}>{property.shortAddress || 'Ubicación no disponible'}</p>
                </div>
                <div className={styles.infoLine}>
                    <p className={styles.price}>${property.price ? property.price.toLocaleString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
