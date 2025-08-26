import React, { createContext, useState, useContext } from 'react';

const ContactPanelContext = createContext();

export const useContactPanel = () => {
    return useContext(ContactPanelContext);
};

export const ContactPanelProvider = ({ children }) => {
    const [contactInfo, setContactInfo] = useState(null);
    const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);

    const showContact = (advisor) => {
        setContactInfo(advisor);
        setIsContactPanelOpen(true);
    };

    const hideContact = () => {
        setIsContactPanelOpen(false);
        setContactInfo(null);
    };

    const value = {
        contactInfo,
        isContactPanelOpen,
        showContact,
        hideContact,
    };

    return (
        <ContactPanelContext.Provider value={value}>
            {children}
        </ContactPanelContext.Provider>
    );
};
