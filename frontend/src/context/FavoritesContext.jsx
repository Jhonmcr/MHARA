import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [allProperties, setAllProperties] = useState([]);
    const { user } = useAuth();

    // Fetch all properties once on component mount
    useEffect(() => {
        fetch('http://localhost:8000/api/v1/properties/')
            .then(res => res.json())
            .then(data => {
                if (data) setAllProperties(data);
            })
            .catch(err => console.error("Error fetching all properties:", err));
    }, []);

    // Fetch user's favorite IDs when user changes
    useEffect(() => {
        if (user && user.username) {
            fetch(`http://localhost:8000/api/v1/users/${user.username}/favorites`)
                .then(res => res.json())
                .then(data => setFavorites(data.favorites || []))
                .catch(err => console.error("Error fetching favorites:", err));
        } else {
            setFavorites([]); // Clear favorites on logout
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

    // Derive the full favorite property objects
    const favoriteProperties = allProperties.filter(property => favorites.includes(property.id));

    const value = {
        favorites,
        handleFavoriteToggle,
        favoriteProperties,
        allProperties, // Pass all properties down as well, might be useful
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
