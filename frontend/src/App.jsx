import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { HomePanelProvider } from './context/HomePanelContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Catalogo from './pages/Catalogo';
import AboutUs from './pages/AboutUs';
import Asesores from './pages/Asesores';
import AdvisorProfile from './pages/AdvisorProfile';
import ProtectedRoutes from './components/ProtectedRoutes';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const AppContent = () => {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} /> {/* Default route */}

                {/* Protected Routes */}
                <Route path="/asesores" element={<Asesores />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/nosotros" element={<AboutUs />} />
                    <Route path="/asesor/:id" element={<AdvisorProfile />} />
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <LoadingProvider>
                <FavoritesProvider>
                    <HomePanelProvider>
                        <AppContent />
                    </HomePanelProvider>
                </FavoritesProvider>
            </LoadingProvider>
        </AuthProvider>
    );
}

export default App;
