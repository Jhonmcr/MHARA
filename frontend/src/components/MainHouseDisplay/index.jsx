import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import styles from './MainHouseDisplay.module.css';
import { FaChevronLeft, FaChevronRight, FaShareAlt } from 'react-icons/fa';
import iconShoping from '../../assets/icons/shoping.png';
import AdvisorContactPopup from '../AdvisorContactPopup';
import toast, { Toaster } from 'react-hot-toast';

const MainHouseDisplay = ({ property, onFavoriteToggle, isFavorite, onImageClick, isGuest }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [advisor, setAdvisor] = useState(null);
    const [isContactPopupOpen, setContactPopupOpen] = useState(false);

    useEffect(() => {
        setCurrentPhotoIndex(0);
        setAdvisor(null);
        setContactPopupOpen(false);

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
        if (isGuest) {
            toast.error("Debes iniciar sesión para contactar al asesor.");
            return;
        }
        if (advisor) {
            setContactPopupOpen(true);
        } else {
            toast.error("Información del asesor no disponible.");
        }
    };

    const handleImageClick = () => {
        if (onImageClick && photos && photos.length > 0) {
            onImageClick(photos, currentPhotoIndex);
        }
    };

    const handleFavoriteClick = () => {
        if (isGuest) {
            toast.error("Debes iniciar sesión para agregar a favoritos.");
            return;
        }
        onFavoriteToggle(property.id);
    };

    const handleShareClick = () => {
        const propertyUrl = `${window.location.origin}/catalogo/${property.id}`;
        navigator.clipboard.writeText(propertyUrl)
            .then(() => {
                toast.success("Enlace copiado al portapapeles");
            })
            .catch(err => {
                toast.error("No se pudo copiar el enlace.");
                console.error('Error al copiar el enlace:', err);
            });
    };
    
    return (
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false} />
            <div 
                className={styles.imageContainer} 
                style={{ backgroundImage: `url(${mainImageUrl})`, cursor: 'pointer' }}
                onClick={handleImageClick}
            >
                {photos && photos.length > 1 && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className={styles.navButtonLeft}>
                            <FaChevronLeft />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className={styles.navButtonRight}>
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
                        onClick={handleFavoriteClick}
                        className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
                        title={isGuest ? "Inicia sesión para agregar a favoritos" : "Agregar a la lista de favoritos"}
                        disabled={isGuest}
                    >
                        <img src={iconShoping} alt="Favorite" />
                    </button>
                    <button
                        onClick={handleShareClick}
                        className={styles.shareButton}
                        title="Compartir propiedad"
                    >
                        <FaShareAlt />
                    </button>
                    <div className={styles.contactAction}>
                        {advisor && (
                            <div className={styles.advisorInfo}>
                                <img src={advisor.profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`} alt={advisor.fullName} className={styles.advisorImage} />
                            </div>
                        )}
                        <button
                            onClick={handleContactClick}
                            className={styles.contactButton}
                            disabled={isGuest}
                            title={isGuest ? "Inicia sesión para contactar al asesor" : "Contactar"}
                        >
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
