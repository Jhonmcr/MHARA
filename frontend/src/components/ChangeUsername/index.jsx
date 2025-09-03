import React, { useState } from 'react';
import apiClient from '../../api/axios';
import './ChangeUsername.css';
import { useAuth } from '../../context/AuthContext';

const ChangeUsername = ({ onClose }) => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        currentUsername: user?.username || '',
        newUsername: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.put(`/users/${user._id}/username`, formData);

            setSuccess('Nombre de usuario actualizado con éxito!');
            setUser(response.data.user); // Update user in context
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar el nombre de usuario';
            setError(errorMessage);
        }
    };

    return (
        <div className="change-username-overlay">
            <div className="change-username-content">
                <div className="change-username-header">
                    <h2>Cambiar Nombre de Usuario</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="change-username-form">
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <div className="form-group">
                        <label htmlFor="currentUsername">Nombre de Usuario Actual</label>
                        <input
                            type="text"
                            id="currentUsername"
                            name="currentUsername"
                            value={formData.currentUsername}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newUsername">Nuevo Nombre de Usuario</label>
                        <input
                            type="text"
                            id="newUsername"
                            name="newUsername"
                            value={formData.newUsername}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña para Confirmar</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeUsername;
