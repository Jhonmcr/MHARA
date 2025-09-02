import React, { useState } from 'react';
import apiClient from '../../api/axios';
import './ChangePassword.css';
import { useAuth } from '../../context/AuthContext';

const ChangePassword = ({ onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
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

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('Las contraseñas nuevas no coinciden.');
            return;
        }

        try {
            await apiClient.put(`/users/${user._id}/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess('Contraseña actualizada con éxito!');
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar la contraseña';
            setError(errorMessage);
        }
    };

    return (
        <div className="change-password-overlay">
            <div className="change-password-content">
                <div className="change-password-header">
                    <h2>Cambiar Contraseña</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="change-password-form">
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <div className="form-group">
                        <label htmlFor="currentPassword">Contraseña Actual</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
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

export default ChangePassword;
