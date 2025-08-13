import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} /> {/* Default route */}

                {/* Protected Routes */}
                <Route element={<ProtectedRoutes />}>
                    <Route path="/home" element={<Home />} />
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
