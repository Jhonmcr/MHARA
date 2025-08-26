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
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        budget: '',
        negotiationType: '',
        propertyType: '',
        rooms: '',
    });
    const [filteredProperties, setFilteredProperties] = useState(properties);

    // Select property from location state or default to first
    useEffect(() => {
        const initialProperties = properties || [];
        if (initialProperties.length > 0) {
            const propertyIdFromState = location.state?.selectedPropertyId;
            if (propertyIdFromState) {
                const propertyToSelect = initialProperties.find(p => p.id === propertyIdFromState);
                if (propertyToSelect) {
                    setSelectedProperty(propertyToSelect);
                }
            } else if (!selectedProperty) {
                setSelectedProperty(initialProperties[0]);
            }
        }
    }, [properties, location.state]);

    useEffect(() => {
        let result = properties || [];

        // Lógica de búsqueda
        if (searchTerm) {
            result = result.filter(p =>
                (p.title && typeof p.title === 'string' && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (p.location && typeof p.location === 'string' && p.location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Lógica de filtros
        if (filters.location) {
            result = result.filter(p => p.location && typeof p.location === 'string' && p.location.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.budget) {
            result = result.filter(p => p.price <= parseInt(filters.budget, 10));
        }
        if (filters.negotiationType) {
            result = result.filter(p => p.negotiation_type === filters.negotiationType);
        }
        if (filters.propertyType) {
            result = result.filter(p => p.property_type === filters.propertyType);
        }
        if (filters.rooms) {
            result = result.filter(p => p.bedrooms >= parseInt(filters.rooms, 10));
        }

        setFilteredProperties(result);

        if (result && result.length > 0) {
            // Si la propiedad seleccionada ya no está en la lista filtrada, selecciona la primera.
            const isSelectedPropertyInFilteredList = result.some(p => p.id === selectedProperty?.id);
            if (!isSelectedPropertyInFilteredList) {
                setSelectedProperty(result[0]);
            }
        } else {
            setSelectedProperty(null);
        }
    }, [properties, searchTerm, filters]);


    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="catalogo-container">
            <HeaderElements
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onApplyFilters={handleApplyFilters}
            />
            <div className="catalogo-body">
                <MainHouseDisplay
                    property={selectedProperty}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
                />
                <Sidebar
                    properties={filteredProperties}
                    onSelectProperty={handleSelectProperty}
                />
            </div>
        </div>
    );
};

export default Catalogo;