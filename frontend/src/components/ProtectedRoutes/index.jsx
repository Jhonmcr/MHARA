import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // While the authentication state is loading, show a loading indicator
        // or return null to render nothing.
        return <div>Cargando...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
