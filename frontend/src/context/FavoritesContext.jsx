import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios'; // Importar
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [allProperties, setAllProperties] = useState([]);
    const { user } = useAuth();

    const fetchAllProperties = React.useCallback(() => {
        apiClient.get('/properties/')
            .then(res => {
                if (res.data) setAllProperties(res.data);
            })
            .catch(err => console.error("Error fetching all properties:", err));
    }, []);

    // Fetch all properties once on component mount
    useEffect(() => {
        fetchAllProperties();
    }, [fetchAllProperties]);

    // Fetch user's favorite IDs when user changes
    useEffect(() => {
        if (user && user.username) {
            apiClient.get(`/users/${user.username}/favorites`)
                .then(res => setFavorites(res.data.favorites || []))
                .catch(err => console.error("Error fetching favorites:", err));
        } else {
            setFavorites([]); // Clear favorites on logout
        }
    }, [user]);

    const handleFavoriteToggle = async (propertyId) => {
        if (!user) return;

        const isFavorite = favorites.includes(propertyId);
        const method = isFavorite ? 'delete' : 'post';
        const url = `/users/${user.username}/favorites/${propertyId}`;

        try {
            await apiClient[method](url);
            setFavorites(prevFavorites =>
                isFavorite
                    ? prevFavorites.filter(id => id !== propertyId)
                    : [...prevFavorites, propertyId]
            );
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
        allProperties,
        refetchAllProperties: fetchAllProperties, // Expose the refetch function
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
