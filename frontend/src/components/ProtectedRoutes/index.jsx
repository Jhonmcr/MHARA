import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
    const [properties, setProperties] = useState(null);

    const fetchProperties = useCallback(async () => {
        try {
            const response = await apiClient.get('/properties/');
            setProperties(response.data);
        } catch (error) {
            console.error("Fallo al obtener las propiedades:", error);
        }
    }, []);

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
