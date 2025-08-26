import React, { useState, useEffect } from 'react';
import styles from './MainHouseDisplay.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import iconShoping from '../../assets/icons/shoping.png';

const MainHouseDisplay = ({ property, onFavoriteToggle, isFavorite }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        // Reset photo index when property changes
        setCurrentPhotoIndex(0);
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
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const mainImageUrl = photos && photos.length > 0 ? photos[currentPhotoIndex] : '';

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
                    >
                        <img src={iconShoping} alt="Favorite" />
                    </button>
                    <button className={styles.contactButton}>
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainHouseDisplay;
