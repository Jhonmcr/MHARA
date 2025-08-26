import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
    const { setProperties } = useFavorites();
    const [properties, setLocalProperties] = useState(null);

    // Encapsulate the fetch logic in a useCallback to pass it down safely
    const fetchProperties = React.useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/properties/');
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            const propertiesData = await response.json();

            const propertiesWithAdvisors = await Promise.all(propertiesData.map(async (property) => {
                if (property.advisor_id) {
                    try {
                        const advisorResponse = await fetch(`http://localhost:8000/api/v1/users/advisors/${property.advisor_id}`);
                        if (advisorResponse.ok) {
                            const advisorData = await advisorResponse.json();
                            return { ...property, advisor: advisorData };
                        }
                    } catch (error) {
                        console.error(`Failed to fetch advisor for property ${property.id}`, error);
                    }
                }
                return property;
            }));

            setLocalProperties(propertiesWithAdvisors);
            setProperties(propertiesWithAdvisors);
        } catch (error) {
            console.error("Fallo al obtener las propiedades:", error);
        }
    }, [setProperties]); // No dependencies, the endpoint is static

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
