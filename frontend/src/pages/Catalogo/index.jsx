import React, { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import './Catalogo.css';
import MainHouseDisplay from '../../components/MainHouseDisplay';
import Sidebar from '../../components/Sidebar';
import HeaderElements from '../../components/HeaderElements';
import { useFavorites } from '../../context/FavoritesContext';

const Catalogo = () => {
    const { properties } = useOutletContext();
    const { favorites, handleFavoriteToggle } = useFavorites();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const location = useLocation();

    // Select property from location state or default to first
    useEffect(() => {
        if (properties && properties.length > 0) {
            const propertyIdFromState = location.state?.selectedPropertyId;
            if (propertyIdFromState) {
                const propertyToSelect = properties.find(p => p.id === propertyIdFromState);
                if (propertyToSelect) {
                    setSelectedProperty(propertyToSelect);
                }
            } else if (!selectedProperty) {
                setSelectedProperty(properties[0]);
            }
        }
    }, [properties, location.state, selectedProperty]);

    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
    };

    return (
        <div className="catalogo-container">
            <HeaderElements />
            <div className="catalogo-body">
                <MainHouseDisplay
                    property={selectedProperty}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
                />
                <Sidebar
                    properties={properties}
                    onSelectProperty={handleSelectProperty}
                />
            </div>
        </div>
    );
};

export default Catalogo;