import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    // You could also add functions here to wrap async calls,
    // but for simplicity, we'll just expose setIsLoading.
    const value = {
        isLoading,
        setIsLoading,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
