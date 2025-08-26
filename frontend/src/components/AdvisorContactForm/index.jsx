import React, { useState } from 'react';
import './AdvisorContactForm.css';

const AdvisorContactForm = ({ advisor, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        phone: advisor?.contact?.phone || '',
        email: advisor?.contact?.email || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="advisor-contact-form-overlay">
            <div className="advisor-contact-form-content">
                <div className="advisor-contact-form-header">
                    <h2>Información de Contacto</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="advisor-contact-form">
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
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
