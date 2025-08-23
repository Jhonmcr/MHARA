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
        code,
        property_type,
        address,
        rooms,
        bathrooms,
        area,
        price,
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
                <div className={styles.code}>Code: {code}</div>
                    <div className={styles.info}>
                        <h2 className={styles.title}>{property_type} en {address}</h2>
                        <div className={styles.specs}>
                            <span>Habitaciones: {rooms}</span>
                            <span>Baños: {bathrooms}</span>
                            <span>Mts2: {area}</span>
                        </div>
                        <div className={styles.price}>
                            Precio: {price}
                        </div>
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
