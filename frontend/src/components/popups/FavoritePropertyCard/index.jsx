import React from 'react';
import styles from './FavoritePropertyCard.module.css';
import { useHomePanel } from '../../../context/HomePanelContext';
import { useNavigate } from 'react-router-dom';
// Helper to parse "Key: Value" strings from customOptions
const parseCustomOptions = (options) => {
    const details = {
        Habitaciones: 'N/A',
        Baños: 'N/A',
        Estacionamiento: 'N/A'
    };

    if (options) {
        options.forEach(opt => {
            const parts = opt.split(':');
            if (parts.length === 2) {
                const key = parts[0].trim().toLowerCase();
                const value = parts[1].trim();
                
                if (key === 'habitaciones') {
                    details.Habitaciones = value;
                } else if (key === 'baños') {
                    details.Baños = value;
                } else if (key === 'estacionamiento') {
                    details.Estacionamiento = value;
                }
            }
        });
    }
    return details;
};

const FavoritePropertyCard = ({ property, onClosePopup, onSelectProperty }) => {
    const { setPanelContent } = useHomePanel();
    const navigate = useNavigate();

    const handleContactClick = (e) => {
        e.stopPropagation(); // Prevent card click from triggering

        if (property.agentDetails) {
            setPanelContent(property.agentDetails);
            onClosePopup(); // Close the favorites popup
            navigate('/home'); // Navigate to home to see the panel
        } else {
            alert("No se encontró información de contacto para esta propiedad.");
            console.error("This property has no agent details.");
        }
    };

    const imageUrl = property.photos && property.photos.length > 0 ? property.photos[0] : "https://via.placeholder.com/80x80";
    const details = parseCustomOptions(property.customOptions);

    const handleCardClick = () => {
        if (onSelectProperty) {
            onSelectProperty(property);
        }
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <img src={imageUrl} alt={property.shortAddress} className={styles.image} />
            <div className={styles.info}>
                <p className={styles.address}>Casa en {property.shortAddress || '...'}</p>
                <p className={styles.details}>
                    Habitaciones: {details.Habitaciones} | Baños: {details.Baños} | Estacionamiento: {details.Estacionamiento}
                </p>
                <p className={styles.price}>${property.price ? property.price.toLocaleString() : 'N/A'}</p>
            </div>
            <button className={styles.contactButton} onClick={handleContactClick}>
                Contactar
            </button>
        </div>
    );
};

export default FavoritePropertyCard;