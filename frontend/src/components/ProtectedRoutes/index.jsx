import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
    const [properties, setProperties] = useState(null);

    // Encapsulate the fetch logic in a useCallback to pass it down safely
    const fetchProperties = React.useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/properties/');
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error("Fallo al obtener las propiedades:", error);
        }
    }, []); // No dependencies, the endpoint is static

    useEffect(() => {
        if (isAuthenticated) {
            fetchProperties();
        }
    }, [isAuthenticated, fetchProperties]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    // Pass down both properties and the function to refetch them
    return isAuthenticated ? <Outlet context={{ properties, refetchProperties: fetchProperties }} /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
