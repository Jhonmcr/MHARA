import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritesPopup.module.css';
import FavoritePropertyCard from '../FavoritePropertyCard'; // Import the new card

const FavoritesPopup = ({ isOpen, onClose, favorites, onSelectProperty }) => {
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }

    const handleSeeMore = () => {
        onClose(); // Close the popup first
        navigate('/catalogo', { state: { showFavorites: true } });
    };

    const hasMoreFavorites = favorites.length > 2;

    return (
        <div className={styles.popupContainer}>
            <div className={styles.header}>
                <h3>Mis Favoritos</h3>
                <button onClick={onClose} className={styles.closeButton}>&times;</button>
            </div>
            <div className={styles.favoritesList}>
                {favorites && favorites.length > 0 ? (
                    favorites.slice(0, 2).map(property => (
                        <FavoritePropertyCard
                            key={property.id}
                            property={property}
                            onClosePopup={onClose}
                            onSelectProperty={onSelectProperty}
                        />
                    ))
                ) : (
                    <p className={styles.emptyMessage}>No tienes propiedades favoritas.</p>
                )}
            </div>
            {hasMoreFavorites && (
                <div className={styles.seeMoreContainer}>
                    <button onClick={handleSeeMore} className={styles.seeMoreButton}>
                        Ver más
                    </button>
                </div>
            )}
        </div>
    );
};

export default FavoritesPopup;
