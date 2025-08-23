import React from 'react';
import styles from './MainHouseDisplay.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MainHouseDisplay = ({ property }) => {
    if (!property) {
        return (
        <div className={styles.container}>
            <p>Selecciona una propiedad de la lista para ver los detalles.</p>
        </div>
        );
    }

    const {
        photos,
        negotiationType,
        detailedAddress,
        price,
        customOptions,
    } = property;

    // Usar la primera foto para la imagen principal, con un fallback.
    const mainImageUrl = photos && photos.length > 0 ? photos[0] : '';

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer} style={{ backgroundImage: `url(${mainImageUrl})` }}>
                <button className={styles.navButtonLeft}>
                <FaChevronLeft />
                </button>
                <button className={styles.navButtonRight}>
                <FaChevronRight />
                </button>
            </div>
            <div className={styles.detailsContainer}>
                {/* <div className={styles.code}>Code: {code}</div> */}
                    <div className={styles.info}>
                        <div>
                            <h2 className={styles.title}>{negotiationType} en {detailedAddress}</h2>
                            {/* <div className={styles.specs}>
                                <span>Habitaciones: {rooms}</span>
                                <span>Baños: {bathrooms}</span>
                                <span>Mts2: {area}</span>
                            </div> */}
                            <div className={styles.price}>
                                Precio: ${price ? price.toLocaleString() : 'No disponible'}
                            </div>
                        </div>
                        {customOptions && customOptions.length > 0 && (
                            <div className={styles.customOptions}>
                                <h5>Otras características:</h5>
                                <ul>
                                    {customOptions.map((option, index) => (
                                        <li key={index}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        </div>
                        <div className={styles.contact}>
                        <div className={styles.profileIcon}>
                    </div>
                    <button className={styles.contactButton}>
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainHouseDisplay;
