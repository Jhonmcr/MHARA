import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axios';
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
            setFoundUser(null);
            try {
                const response = await apiClient.get(`/users/by-code/${searchTerm.trim()}`);
                const user = response.data;
                setFoundUser(user);
                setIsAdvisor(user.role === 'asesor');
            } catch (error) {
                console.error("Error fetching user by code:", error);
                setFoundUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchUser();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleToggleAdvisorRole = async () => {
        if (!foundUser) return;

        const newRole = isAdvisor ? 'user' : 'asesor';

        try {
            const response = await apiClient.put(`/users/${foundUser._id}/role`, { role: newRole });
            const updatedUser = response.data.user;
            setFoundUser(updatedUser);
            setIsAdvisor(updatedUser.role === 'asesor');
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
