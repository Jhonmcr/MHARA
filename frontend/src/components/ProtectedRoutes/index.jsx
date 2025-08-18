import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
    const [properties, setProperties] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Adjust the fetch URL to your backend endpoint
                const response = await fetch('/api/v1/properties');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error("Failed to fetch properties:", error);
                // Handle error appropriately
            }
        };

        if (isAuthenticated) {
            fetchProperties();
        }
    }, [isAuthenticated]);

    if (loading) {
        // While the authentication state is loading, show a loading indicator
        // or return null to render nothing.
        return <div>Cargando...</div>;
    }

    // Pass the properties to the child routes
    return isAuthenticated ? <Outlet context={{ properties }} /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
