import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
    const [properties, setProperties] = useState(null);

    const fetchProperties = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/properties/`);
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            const propertiesData = await response.json();
            setProperties(propertiesData);
        } catch (error) {
            console.error("Fallo al obtener las propiedades:", error);
        }
    }, []); // No dependencies needed as fetch URL is static and setProperties is stable

    useEffect(() => {
        if (isAuthenticated) {
            fetchProperties();
        }
    }, [isAuthenticated, fetchProperties]);

    if (loading || (isAuthenticated && properties === null)) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Outlet context={{ properties, refetchProperties: fetchProperties }} />;
};

export default ProtectedRoutes;
