import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [properties, setProperties] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.username) {
            fetch(`http://localhost:8000/api/v1/users/${user.username}/favorites`)
                .then(res => res.json())
                .then(data => setFavorites(data.favorites || []))
                .catch(err => console.error("Error fetching favorites:", err));
        }
    }, [user]);

    const handleFavoriteToggle = async (propertyId) => {
        if (!user) return;

        const isFavorite = favorites.includes(propertyId);
        const method = isFavorite ? 'DELETE' : 'POST';
        const url = `http://localhost:8000/api/v1/users/${user.username}/favorites/${propertyId}`;

        try {
            const response = await fetch(url, { method });
            if (response.ok) {
                setFavorites(prevFavorites =>
                    isFavorite
                        ? prevFavorites.filter(id => id !== propertyId)
                        : [...prevFavorites, propertyId]
                );
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    const favoriteProperties = properties.filter(property => favorites.includes(property.id));

    const value = {
        favorites,
        handleFavoriteToggle,
        setProperties,
        favoriteProperties,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
    return useContext(FavoritesContext);
};
