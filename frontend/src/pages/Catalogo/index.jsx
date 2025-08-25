import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Catalogo.css';
import MainHouseDisplay from '../../components/MainHouseDisplay';
import Sidebar from '../../components/Sidebar';
import HeaderElements from '../../components/HeaderElements';
import { useAuth } from '../../context/AuthContext';

const Catalogo = () => {
    const { properties } = useOutletContext();
    const { user } = useAuth();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Fetch favorites on component mount and when user changes
    useEffect(() => {
        if (user && user.username) {
            fetch(`http://localhost:8000/api/v1/users/${user.username}/favorites`)
                .then(res => res.json())
                .then(data => setFavorites(data.favorites || []))
                .catch(err => console.error("Error fetching favorites:", err));
        }
    }, [user]);

    // Select the first property by default
    useEffect(() => {
        if (properties && properties.length > 0 && !selectedProperty) {
            setSelectedProperty(properties[0]);
        }
    }, [properties, selectedProperty]);

    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
    };

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

    return (
        <div className="catalogo-container">
            <HeaderElements />
            <div className="catalogo-body">
                <MainHouseDisplay property={selectedProperty} />
                <Sidebar
                    properties={properties}
                    onSelectProperty={handleSelectProperty}
                    favorites={favorites}
                    onFavoriteToggle={handleFavoriteToggle}
                />
            </div>
        </div>
    );
};

export default Catalogo;