import React from 'react';
import styles from './PropertyCard.module.css';

const PropertyCard = ({ property, onSelect }) => {
    // Determinar la URL de la imagen. Usar la primera foto si existe, si no, un placeholder.
    const imageUrl = property.photos && property.photos.length > 0
        ? property.photos[0]
        : "https://via.placeholder.com/100x80";

    // Usar los campos correctos del backend.
    const title = property.negotiationType || 'Propiedad';
    const address = property.detailedAddress || 'Dirección no disponible';

    return (
        <div className={styles.propertyCard} onClick={onSelect}>
            <img src={imageUrl} alt={title} className={styles.propertyImage} />
            <div className={styles.propertyInfo}>
                <h4>{title}</h4>
                <p>{address}</p>
            </div>
        </div>
    );
};

export default PropertyCard;
