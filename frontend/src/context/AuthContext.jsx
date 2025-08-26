import React, { createContext, useState, useContext, useEffect } from 'react';
import GenericPopup from '../components/popups/GenericPopup';
import AddAdvisorForm from '../components/popups/AddAdvisorForm';
import ChangeUsername from '../components/ChangeUsername';
import ChangePassword from '../components/ChangePassword';
import LogoutConfirmationPopup from '../components/LogoutConfirmationPopup';
import AdvisorContactForm from '../components/AdvisorContactForm';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePopup, setActivePopup] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user'); // Clear corrupted data
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        console.log("Logging in user:", userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const openPopup = (popupName) => setActivePopup(popupName);
    const closePopup = () => setActivePopup(null);

    const handleAddAdvisor = async (advisorData) => {
        console.log('Attempting to add advisor:', advisorData);
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/make-advisor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // In a real app, an auth token would be sent.
                    // 'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({
                    username: advisorData.username,
                    advisor_code: advisorData.advisorCode,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || 'Ocurrió un error al agregar al asesor.');
            }

            alert(result.message); // Show success message
            setRefetchTrigger(prev => prev + 1); // Trigger refetch
            closePopup(); // Close popup on success

        } catch (error) {
            console.error('Error adding advisor:', error.message);
            alert(`Error: ${error.message}`); // Show error message
            // We might not want to close the popup on error, so the user can retry
        }
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        openPopup,
        closePopup,
        refetchTrigger,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}

            {/* Render popups here */}
            <GenericPopup
                isOpen={activePopup === 'addAdvisor'}
                onClose={closePopup}
                title="Agregar Nuevo Asesor"
            >
                <AddAdvisorForm onAddAdvisor={handleAddAdvisor} />
            </GenericPopup>

            {activePopup === 'changeUsername' && <ChangeUsername onClose={closePopup} />}
            {activePopup === 'changePassword' && <ChangePassword onClose={closePopup} />}
            {activePopup === 'logout' && <LogoutConfirmationPopup onConfirm={logout} onCancel={closePopup} />}
            {activePopup === 'addContactInfo' && <AdvisorContactForm advisor={user} onClose={closePopup} onSubmit={() => {}} />}

        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};