import React, { useState } from 'react';
import './UploadPropertyPopup.css';

const UploadPropertyPopup = ({ onClose, onPublish }) => {
    const [propertyData, setPropertyData] = useState({
        photos: [],
        rooms: '',
        bathrooms: '',
        parking: '',
        pool: false,
        price: '',
        negotiationType: 'Venta',
        location: '',
        agentCode: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPropertyData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePublish = () => {
        if (!propertyData.price || !propertyData.location || !propertyData.agentCode) {
            alert('Por favor, complete los campos obligatorios: Precio, Ubicación, Código del Asesor.');
            return;
        }
        onPublish(propertyData);
    };

    return (
        <div className="popup-overlay">
        <div className="popup-content">
            <h2>Subir Nueva Propiedad</h2>
            
            <div className="form-grid">
            <label>Fotos: <input type="file" multiple /></label>
            <label>Habitaciones: <input type="number" name="rooms" value={propertyData.rooms} onChange={handleChange} /></label>
            <label>Baños: <input type="number" name="bathrooms" value={propertyData.bathrooms} onChange={handleChange} /></label>
            <label>Estacionamiento: <input type="number" name="parking" value={propertyData.parking} onChange={handleChange} /></label>
            <label className="checkbox-label">Piscina: <input type="checkbox" name="pool" checked={propertyData.pool} onChange={handleChange} /></label>
            <label>Precio (€): <input type="text" name="price" value={propertyData.price} onChange={handleChange} required /></label>
            <label>Tipo de Negociación: 
                <select name="negotiationType" value={propertyData.negotiationType} onChange={handleChange}>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
                </select>
            </label>
            <label>Ubicación: <input type="text" name="location" value={propertyData.location} onChange={handleChange} required /></label>
            <label>Código del Asesor: <input type="text" name="agentCode" value={propertyData.agentCode} onChange={handleChange} required /></label>
            </div>

            <div className="popup-actions">
            <button onClick={handlePublish} className="publish-btn">Publicar Propiedad</button>
            <button onClick={onClose} className="close-btn">Cerrar</button>
            </div>
        </div>
        </div>
    );
};

export default UploadPropertyPopup;
