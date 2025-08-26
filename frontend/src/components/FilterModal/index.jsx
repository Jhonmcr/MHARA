import React, { useState, useEffect } from 'react';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onApplyFilters, onClearFilters }) => {
    const [filters, setFilters] = useState({
        location: '',
        budget: '',
        negotiationType: '',
        propertyType: '',
        rooms: '',
    });
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset local state if modal is closed without applying
            // This could be adjusted based on desired UX
            setFilters({ location: '', budget: '', negotiationType: '', propertyType: '', rooms: '' });
        }
    }, [isOpen]);

    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => setShowAlert(false), 5000);
        }
        return () => clearTimeout(timer);
    }, [showAlert]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        if (showAlert) setShowAlert(false);
    };

    const handleApply = (e) => {
        e.preventDefault();
        if (Object.values(filters).every(v => v === '')) {
            setShowAlert(true);
        } else {
            onApplyFilters(filters);
            onClose();
        }
    };

    const handleClear = () => {
        const clearedFilters = { location: '', budget: '', negotiationType: '', propertyType: '', rooms: '' };
        setFilters(clearedFilters);
        onClearFilters(); // Notify parent to clear its state
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Filtros</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {showAlert && <div className="alert-message">Debes llenar al menos un campo.</div>}
                    <form onSubmit={handleApply}>
                        {/* Input groups */}
                        <div className="filter-group">
                            <label htmlFor="location">Ubicación</label>
                            <input type="text" id="location" name="location" value={filters.location} onChange={handleInputChange} />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="budget">Presupuesto</label>
                            <input type="number" id="budget" name="budget" value={filters.budget} onChange={handleInputChange} />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="negotiationType">Tipo de negociación</label>
                            <select id="negotiationType" name="negotiationType" value={filters.negotiationType} onChange={handleInputChange}>
                                <option value="">Todos</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="propertyType">Tipo de propiedad</label>
                            <select id="propertyType" name="propertyType" value={filters.propertyType} onChange={handleInputChange}>
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="terreno">Terreno</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="rooms">Habitaciones</label>
                            <input type="number" id="rooms" name="rooms" min="1" value={filters.rooms} onChange={handleInputChange} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="clear-filters-button" onClick={handleClear}>
                                Limpiar Filtros
                            </button>
                            <button type="submit" className="apply-filters-button">Aplicar Filtros</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;