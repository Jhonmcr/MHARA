import React from 'react';
import styles from './FavoritesPopup.module.css';
import PropertyCard from '../../PropertyCard';
import GenericPopup from '../GenericPopup';

const FavoritesPopup = ({ isOpen, onClose, favorites, onSelectProperty }) => {
    return (
        <GenericPopup isOpen={isOpen} onClose={onClose} title="Mis Favoritos">
            <div className={styles.favoritesList}>
                {favorites && favorites.length > 0 ? (
                    favorites.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onSelect={onSelectProperty}
                        />
                    ))
                ) : (
                    <p>No tienes propiedades favoritas.</p>
                )}
            </div>
        </GenericPopup>
    );
};

export default FavoritesPopup;
