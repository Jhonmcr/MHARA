import React from 'react';
import styles from './FavoritesPopup.module.css';
import FavoritePropertyCard from '../FavoritePropertyCard'; // Import the new card

const FavoritesPopup = ({ isOpen, onClose, favorites }) => {
    if (!isOpen) {
        return null;
    }

    // This popup will now be positioned by its parent,
    // so we just render the container.
    return (
        <div className={styles.popupContainer}>
            <div className={styles.header}>
                <h3>Mis Favoritos</h3>
                <button onClick={onClose} className={styles.closeButton}>&times;</button>
            </div>
            <div className={styles.favoritesList}>
                {favorites && favorites.length > 0 ? (
                    favorites.map(property => (
                        <FavoritePropertyCard
                            key={property.id}
                            property={property}
                            onClosePopup={onClose}
                        />
                    ))
                ) : (
                    <p className={styles.emptyMessage}>No tienes propiedades favoritas.</p>
                )}
            </div>
        </div>
    );
};

export default FavoritesPopup;
