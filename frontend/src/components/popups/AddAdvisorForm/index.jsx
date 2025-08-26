import React, { useState, useEffect } from 'react';
import './AddAdvisorForm.css';

const AddAdvisorForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [isAdvisor, setIsAdvisor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.trim().length < 2) { // No buscar si el término es muy corto
            setFoundUser(null);
            return;
        }

        const fetchUser = async () => {
            setIsLoading(true);
            try {
                // Usar el nuevo endpoint de búsqueda
                const response = await fetch(`http://localhost:8000/api/v1/users/search/${searchTerm}`);
                if (response.ok) {
                    const usersData = await response.json();
                    if (usersData.length > 0) {
                        // Tomamos el primer resultado para mantener la UI simple
                        const user = usersData[0];
                        setFoundUser(user);
                        setIsAdvisor(user.role === 'asesor');
                    } else {
                        setFoundUser(null);
                    }
                } else {
                    setFoundUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setFoundUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchUser();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleToggleAdvisorRole = async () => {
        if (!foundUser) return;

        const newRole = isAdvisor ? 'user' : 'asesor';

        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${foundUser._id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
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
                <label htmlFor="username">Buscar Usuario por Nombre de Usuario</label>
                <input
                    type="text"
                    id="username"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ej. juanperez"
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
