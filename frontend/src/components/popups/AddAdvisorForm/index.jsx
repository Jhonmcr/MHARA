import React, { useState, useEffect } from 'react';
import './AddAdvisorForm.css';

const AddAdvisorForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [isAdvisor, setIsAdvisor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Only search when the code is exactly 5 characters long
        if (searchTerm.trim().length !== 5) {
            setFoundUser(null);
            return;
        }

        const fetchUser = async () => {
            setIsLoading(true);
            setFoundUser(null); // Reset previous user
            try {
                // Use the new endpoint to search by agent code
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/users/by-code/${searchTerm.trim()}`);
                if (response.ok) {
                    const user = await response.json();
                    setFoundUser(user);
                    setIsAdvisor(user.role === 'asesor');
                } else {
                    // If not found or other error, ensure no user is displayed
                    setFoundUser(null);
                }
            } catch (error) {
                console.error("Error fetching user by code:", error);
                setFoundUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        // No debounce needed if we search on exact length, but can be kept
        const debounceTimer = setTimeout(() => {
            fetchUser();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleToggleAdvisorRole = async () => {
        if (!foundUser) return;

        const newRole = isAdvisor ? 'user' : 'asesor';

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/users/${foundUser._id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                const responseData = await response.json();
                const updatedUser = responseData.user;
                setFoundUser(updatedUser);
                setIsAdvisor(updatedUser.role === 'asesor');
            } else {
                console.error("Failed to update user role");
            }
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    return (
        <form className="add-advisor-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
                <label htmlFor="agentCode">Buscar Usuario por Código de Agente</label>
                <input
                    type="text"
                    id="agentCode"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                    placeholder="ej. A1B2C"
                    maxLength="5"
                />
            </div>

            {isLoading && <p>Buscando...</p>}

            {foundUser && (
                <div className="toggle-button-container">
                    <button
                        type="button"
                        onClick={handleToggleAdvisorRole}
                        className={`toggle-button ${isAdvisor ? 'toggled' : ''}`}
                    >
                        <span className="toggle-button-text">
                            {isAdvisor ? 'Quitar Asesor' : 'Hacer Asesor'}
                        </span>
                        <div className="toggle-switch"></div>
                    </button>
                </div>
            )}
        </form>
    );
};

export default AddAdvisorForm;
