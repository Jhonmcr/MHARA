import React, { createContext, useState, useContext } from 'react';

const HomePanelContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useHomePanel = () => {
    return useContext(HomePanelContext);
};

export const HomePanelProvider = ({ children }) => {
    // State can be 'default', 'profile', or an object with contact data
    const [panelContent, setPanelContent] = useState('default');

    const value = {
        panelContent,
        setPanelContent,
    };

    return (
        <HomePanelContext.Provider value={value}>
            {children}
        </HomePanelContext.Provider>
    );
};
