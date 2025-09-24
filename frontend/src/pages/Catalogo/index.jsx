import React, { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import './Catalogo.css';
import MainHouseDisplay from '../../components/MainHouseDisplay';
import SidebarCatalogo from '../../components/SidebarCatalogo';
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
        const lowercasedSearchTerm = searchTerm.toLowerCase();

        // Handle the "showFavorites" state from navigation
        if (location.state?.showFavorites) {
            result = result.filter(p => favorites.includes(p.id));
        }

        // Lógica de búsqueda integral ("con todo")
        if (searchTerm) {
            result = result.filter(p => {
                const searchString = [
                    p.code,
                    p.shortAddress,
                    p.detailedAddress,
                    p.negotiationType,
                    ...(p.customOptions || [])
                ].join(' ').toLowerCase();
                return searchString.includes(lowercasedSearchTerm);
            });
        }

        // Lógica de filtros corregida
        if (filters.location) {
            result = result.filter(p => (p.detailedAddress || '').toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.budget) {
            result = result.filter(p => p.price && p.price <= parseInt(filters.budget, 10));
        }
        if (filters.negotiationType) {
            result = result.filter(p => p.negotiationType === filters.negotiationType);
        }
        
        if (filters.propertyType) {
            result = result.filter(p => p.customOptions && p.customOptions.includes(filters.propertyType));
        }
        if (filters.rooms) {
            const roomNumber = parseInt(filters.rooms, 10);
            result = result.filter(p => 
                p.customOptions && p.customOptions.some(opt => {
                    const match = opt.match(/(\d+)\s+habitaciones?/i);
                    return match && parseInt(match[1], 10) >= roomNumber;
                })
            );
        }

        setFilteredProperties(result);

        if (result && result.length > 0) {
            const isSelectedPropertyInFilteredList = result.some(p => p.id === selectedProperty?.id);
            if (!isSelectedPropertyInFilteredList) {
                setSelectedProperty(result[0]);
            }
        } else {
            setSelectedProperty(null);
        }
    }, [properties, searchTerm, filters, selectedProperty?.id]);


    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            location: '',
            budget: '',
            negotiationType: '',
            propertyType: '',
            rooms: '',
        });
    };

    return (
        <div className="catalogo-container">
            <HeaderElements
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
            <div className="catalogo-body">
                <MainHouseDisplay
                    property={selectedProperty}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
                />
                <SidebarCatalogo
                    properties={filteredProperties}
                    onSelectProperty={handleSelectProperty}
                />
            </div>
        </div>
    );
};

export default Catalogo;