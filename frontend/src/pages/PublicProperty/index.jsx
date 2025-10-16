import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import styles from './PublicProperty.module.css';

const PublicProperty = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/properties/public/${propertyId}`);
                setProperty(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching public property:", err);
                setError("No se pudo cargar la propiedad. Es posible que el enlace no sea válido o que la propiedad ya no esté disponible.");
                setProperty(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    const handleRedirect = () => {
        navigate('/login');
    };

    if (loading) {
        return <div className={styles.container}><p>Cargando propiedad...</p></div>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.error}>{error}</p>
                <button onClick={() => navigate('/')} className={styles.actionButton}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    const { photos, price } = property;

    const nextPhoto = () => {
        setCurrentPhotoIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Vista Pública de la Propiedad</h1>
                <p className={styles.subtitle}>Para ver más detalles o contactar a un asesor, por favor regístrate o inicia sesión.</p>

                {photos && photos.length > 0 && (
                    <div className={styles.gallery}>
                        <img src={photos[currentPhotoIndex]} alt={`Propiedad ${currentPhotoIndex + 1}`} className={styles.photo} />
                        {photos.length > 1 && (
                            <>
                                <button onClick={prevPhoto} className={`${styles.navButton} ${styles.prev}`}>&#10094;</button>
                                <button onClick={nextPhoto} className={`${styles.navButton} ${styles.next}`}>&#10095;</button>
                            </>
                        )}
                    </div>
                )}

                <div className={styles.price}>
                    Precio: ${price ? price.toLocaleString() : 'No disponible'}
                </div>

                <div className={styles.actions}>
                    <button onClick={handleRedirect} className={styles.actionButton}>
                        Ver más propiedades
                    </button>
                    <button onClick={handleRedirect} className={styles.actionButton}>
                        Contactar Asesor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicProperty;