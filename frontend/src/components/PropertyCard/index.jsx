import React from 'react';
import styles from './PropertyCard.module.css';
import { FaHeart } from 'react-icons/fa';

const PropertyCard = ({ property, onSelect, onFavoriteToggle, isFavorite }) => {
    const imageUrl = property.photos && property.photos.length > 0
        ? property.photos[0]
        : "https://via.placeholder.com/100x80";

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Evitar que se seleccione la propiedad al hacer clic en el corazón
        onFavoriteToggle(property.id);
    };

    return (
        <div className={styles.propertyCard} onClick={() => onSelect(property)}>
            <img src={imageUrl} alt={property.shortAddress} className={styles.propertyImage} />
            <div className={styles.propertyInfo}>
                <div className={styles.infoLine}>
                    <p className={styles.address}>{property.shortAddress || 'Ubicación no disponible'}</p>
                </div>
                <div className={styles.infoLine}>
                    <p className={styles.price}>${property.price ? property.price.toLocaleString() : 'N/A'}</p>
                    <button
                        onClick={handleFavoriteClick}
                        className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
                    >
                        <FaHeart />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
