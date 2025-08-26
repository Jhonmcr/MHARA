import React, { useState, useEffect } from 'react';
import Sidebar from '../../Sidebar';
import './EditPropertySelectionPopup.css';

const EditPropertySelectionPopup = ({ properties, onClose, onSelectProperty }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProperties, setFilteredProperties] = useState(properties);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = properties.filter(property => {
            // Se puede buscar por dirección o código
            return (
                (property.detailedAddress || '').toLowerCase().includes(lowercasedFilter) ||
                (property.code || '').toLowerCase().includes(lowercasedFilter)
            );
        });
        setFilteredProperties(filtered);
    }, [searchTerm, properties]);

    return (
        <div className="popup-overlay">
            <div className="popup-content edit-selection-popup">
                <button onClick={onClose} className="close-button-edit">&times;</button>
                <h2>Seleccionar Propiedad para Editar</h2>
                <input
                    type="text"
                    placeholder="Buscar por dirección, código..."
                    className="search-bar-popup"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="sidebar-container-popup">
                    <Sidebar
                        properties={filteredProperties}
                        onSelectProperty={onSelectProperty}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditPropertySelectionPopup;
