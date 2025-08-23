import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // 1. Add loading state

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('userToken');
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to access localStorage", error);
        } finally {
            setLoading(false); // 2. Set loading to false after checking
        }
    }, []);

    const login = () => {
        const dummyToken = 'dummy-auth-token';
        localStorage.setItem('userToken', dummyToken);
        setToken(dummyToken);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setToken(null);
    };

    const value = {
        token,
        loading, // 3. Expose loading state
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
