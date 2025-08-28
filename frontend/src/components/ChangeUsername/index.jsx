import React, { useState } from 'react';
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
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/users/${user._id}/username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Nombre de usuario actualizado con éxito!');
                setUser(data.user); // Update user in context
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                throw new Error(data.message || 'Error al actualizar el nombre de usuario');
            }
        } catch (err) {
            setError(err.message);
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
