import React, { useState } from 'react';
import './AdvisorContactForm.css';
import { useAuth } from '../../context/AuthContext';

const AdvisorContactForm = ({ onClose }) => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        phone: user?.contactInfo?.phone || '',
        email: user?.contactInfo?.email || '',
        instagram: user?.contactInfo?.instagram || '',
        tiktok: user?.contactInfo?.tiktok || '',
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

        if (!user?._id) {
            setError("No se pudo identificar al usuario.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${user._id}/contact-info`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Información de contacto actualizada con éxito!');
                setUser(data.user); // Update user in context
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                throw new Error(data.detail || 'Error al actualizar la información.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="advisor-contact-form-overlay">
            <div className="advisor-contact-form-content">
                <div className="advisor-contact-form-header">
                    <h2>Información de Contacto</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="advisor-contact-form">
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    
                    <div className="form-group-social">
                        <img src="https://www.gstatic.com/images/icons/material/system/2x/phone_black_24dp.png" alt="Phone" className="social-icon" />
                        <input type="text" id="phone" name="phone" placeholder="Número de Teléfono" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group-social">
                        <img src="https://www.gstatic.com/images/icons/material/system/2x/email_black_24dp.png" alt="Email" className="social-icon" />
                        <input type="email" id="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group-social">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="social-icon" />
                        <input type="text" id="instagram" name="instagram" placeholder="Usuario de Instagram (sin @)" value={formData.instagram} onChange={handleChange} />
                    </div>
                    <div className="form-group-social">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/96px-Tiktok_icon.svg.png" alt="TikTok" className="social-icon" />
                        <input type="text" id="tiktok" name="tiktok" placeholder="Usuario de TikTok (sin @)" value={formData.tiktok} onChange={handleChange} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdvisorContactForm;
