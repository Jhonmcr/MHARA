import React from 'react';
import styles from './FavoritePropertyCard.module.css';
import { useHomePanel } from '../../../context/HomePanelContext';
import { useNavigate } from 'react-router-dom';

// Helper to parse customOptions
const parseCustomOptions = (options) => {
    const details = {
        Habitaciones: 'N/A',
        baños: 'N/A',
        Mts2: 'N/A'
    };
    if (options) {
        options.forEach(opt => {
            const [key, value] = opt.split(':');
            if (key && value && details.hasOwnProperty(key.trim())) {
                details[key.trim()] = value.trim();
            }
        });
    }
    return details;
};

const FavoritePropertyCard = ({ property, onClosePopup }) => {
    const { setPanelContent } = useHomePanel();
    const navigate = useNavigate();

    const handleContactClick = async (e) => {
        e.stopPropagation(); // Prevent card click from triggering

        if (!property.agentCode) {
            console.error("This property has no agent code.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/advisor/${property.agentCode}`);
            if (response.ok) {
                const advisorData = await response.json();
                setPanelContent(advisorData);
                onClosePopup(); // Close the favorites popup
                navigate('/home'); // Navigate to home to see the panel
            } else {
                console.error("Failed to fetch advisor details. Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching advisor:", error);
        }
    };

    const imageUrl = property.photos && property.photos.length > 0 ? property.photos[0] : "https://via.placeholder.com/80x80";
    const details = parseCustomOptions(property.customOptions);

    return (
        <div className={styles.card}>
            <img src={imageUrl} alt={property.shortAddress} className={styles.image} />
            <div className={styles.info}>
                <p className={styles.address}>Casa en {property.shortAddress || '...'}</p>
                <p className={styles.details}>
                    Habitaciones: {details.Habitaciones}, baños: {details.baños}, Mts2: {details.Mts2}
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
