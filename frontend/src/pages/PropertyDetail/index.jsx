import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios'; // Asumiendo que axios está configurado
import { useAuth } from '../../context/AuthContext';
import MainHouseDisplay from '../../components/MainHouseDisplay'; // Reutilizando componente
import HeaderElements from '../../components/HeaderElements'; // Reutilizando componente
import FullscreenGallery from '../../components/FullscreenGallery';
import { useFavorites } from '../../context/FavoritesContext';
import './PropertyDetail.css';

const PropertyDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const { favorites, handleFavoriteToggle } = useFavorites();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [galleryState, setGalleryState] = useState({ isOpen: false, images: [], startIndex: 0 });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/properties/${id}`);
                setProperty(response.data);
                setError(null);
            } catch (err) {
                setError('No se pudo cargar la propiedad. Por favor, intente más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const openGallery = (images, startIndex = 0) => {
        setGalleryState({ isOpen: true, images, startIndex });
    };

    const closeGallery = () => {
        setGalleryState({ isOpen: false, images: [], startIndex: 0 });
    };
    
    // Renderizado condicional basado en el estado
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!property) {
        return <div>Propiedad no encontrada.</div>;
    }

    // Lógica para modo invitado
    const isGuest = !isAuthenticated;
    
    return (
        <div className="catalogo-container">
            <HeaderElements isGuest={isGuest} />
            <div className="catalogo-body">
                <MainHouseDisplay
                    property={property}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={favorites.includes(property.id)}
                    onImageClick={openGallery}
                    isGuest={isGuest} 
                />
                
                <div className="sidebar-placeholder">
                    {isGuest && (
                        <div className="guest-prompt">
                            <h3>Inicia sesión para ver más propiedades</h3>
                            <p>Únete para acceder a todas las funcionalidades y encontrar la casa de tus sueños.</p>
                            <a href="/login" className="btn-login">Iniciar Sesión</a>
                        </div>
                    )}
                </div>
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

export default PropertyDetail;
