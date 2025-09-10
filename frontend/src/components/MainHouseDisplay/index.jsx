import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import styles from './MainHouseDisplay.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import iconShoping from '../../assets/icons/shoping.png';
import AdvisorContactPopup from '../AdvisorContactPopup'; // Import the popup

const MainHouseDisplay = ({ property, onFavoriteToggle, isFavorite }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [advisor, setAdvisor] = useState(null);
    const [isContactPopupOpen, setContactPopupOpen] = useState(false); // State for popup

    useEffect(() => {
        setCurrentPhotoIndex(0);
        setAdvisor(null);
        setContactPopupOpen(false); // Close popup when property changes

        if (property && property.agentCode) {
            apiClient.get(`/users/by-code/${property.agentCode}`)
                .then(res => setAdvisor(res.data))
                .catch(err => console.error("Error fetching advisor for MainHouseDisplay:", err));
        }
    }, [property]);

    if (!property) {
        return (
            <div className={styles.container}>
                <p>Selecciona una propiedad de la lista para ver los detalles.</p>
            </div>
        );
    }

    const {
        code,
        photos,
        negotiationType,
        detailedAddress,
        price,
        customOptions,
    } = property;

    const nextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === (photos?.length - 1) ? 0 : prevIndex + 1
        );
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? (photos?.length - 1) : prevIndex - 1
        );
    };

    const mainImageUrl = photos && photos.length > 0 ? photos[currentPhotoIndex] : '';

    const handleContactClick = () => {
        if (advisor) {
            setContactPopupOpen(true); // Open the popup
        } else {
            alert("Información del asesor no disponible en este momento.");
            console.log("Advisor data is not available yet.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer} style={{ backgroundImage: `url(${mainImageUrl})` }}>
                {photos && photos.length > 1 && (
                    <>
                        <button onClick={prevPhoto} className={styles.navButtonLeft}>
                            <FaChevronLeft />
                        </button>
                        <button onClick={nextPhoto} className={styles.navButtonRight}>
                            <FaChevronRight />
                        </button>
                    </>
                )}
                {code && <div className={styles.code}>Código: {code}</div>}
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.info}>
                    <div className={styles.info_name_price}>
                        <h2 className={styles.title}>{negotiationType} en {detailedAddress}</h2>
                        <div className={styles.price}>
                            Precio: ${price ? price.toLocaleString() : 'No disponible'}
                        </div>
                    </div>
                    {customOptions && customOptions.length > 0 && (
                        <div className={styles.customOptions}>
                            <h4>Otras características:</h4>
                            <ul>
                                {customOptions.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className={styles.contact}>
                    <button
                        onClick={() => onFavoriteToggle(property.id)}
                        className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
                        title="Agregar a la lista de favoritos"
                    >
                        <img src={iconShoping} alt="Favorite" />
                    </button>
                    <div className={styles.contactAction}>
                        {advisor && (
                            <div className={styles.advisorInfo}>
                                <img src={advisor.profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`} alt={advisor.fullName} className={styles.advisorImage} />
                            </div>
                        )}
                        <button onClick={handleContactClick} className={styles.contactButton}>
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
            {isContactPopupOpen && advisor && (
                <AdvisorContactPopup
                    advisor={advisor}
                    onClose={() => setContactPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default MainHouseDisplay;
