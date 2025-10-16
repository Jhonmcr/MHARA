import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Catalogo.css';
import MainHouseDisplay from '../../components/MainHouseDisplay';
import SidebarCatalogo from '../../components/SidebarCatalogo';
import HeaderElements from '../../components/HeaderElements';
import FullscreenGallery from '../../components/FullscreenGallery'; // Importar el componente
import { useFavorites } from '../../context/FavoritesContext';

import apiClient from '../../api/axios';

const Catalogo = () => {
    const [properties, setProperties] = useState([]);
    const { favorites, handleFavoriteToggle } = useFavorites();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [galleryState, setGalleryState] = useState({ isOpen: false, images: [], startIndex: 0 });
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/properties');
                setProperties(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching properties for catalog:", err);
                setError("No se pudieron cargar las propiedades. Por favor, inténtalo de nuevo más tarde.");
                setProperties([]); // Asegurarse de que no hay propiedades si hay un error
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

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

    const openGallery = (images, startIndex = 0) => {
        setGalleryState({ isOpen: true, images, startIndex });
    };

    const closeGallery = () => {
        setGalleryState({ isOpen: false, images: [], startIndex: 0 });
    };

    if (loading) {
        return <div>Cargando propiedades...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                    onImageClick={openGallery}
                />
                <SidebarCatalogo
                    properties={filteredProperties}
                    onSelectProperty={handleSelectProperty}
                />
            </div>

            {galleryState.isOpen && (
                <FullscreenGallery
                    images={galleryState.images}
                    startIndex={galleryState.startIndex}
                    onClose={closeGallery}
                />
            )}
        </div>
    );
};

export default Catalogo;