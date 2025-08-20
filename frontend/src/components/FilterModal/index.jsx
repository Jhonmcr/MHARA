import React, { useState, useEffect } from 'react';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
    // Estado para los campos del formulario
    const [filters, setFilters] = useState({
        location: '',
        budget: '',
        negotiationType: '',
        propertyType: '',
        rooms: '',
    });
    // Estado para la visibilidad de la alerta
    const [showAlert, setShowAlert] = useState(false);

    // Efecto para controlar el temporizador de la alerta
    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000); // 5000 milisegundos = 5 segundos
        }
        
        // Función de limpieza para evitar fugas de memoria
        return () => {
            clearTimeout(timer);
        };
    }, [showAlert]); // El efecto se ejecuta cuando 'showAlert' cambia

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
        if (showAlert) {
            setShowAlert(false);
        }
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        
        const isFormEmpty = Object.values(filters).every(value => value === '' || value === null);

        if (isFormEmpty) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
            onApplyFilters(filters);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Filtros</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {showAlert && (
                        <div className="alert-message">
                            Debes llenar al menos un campo para aplicar el filtro.
                        </div>
                    )}
                    <form onSubmit={handleApplyFilters}>
                        <div className="filter-group">
                            <label htmlFor="location">Ubicación</label>
                            <input 
                                type="text" 
                                id="location" 
                                name="location" 
                                value={filters.location}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="budget">Presupuesto</label>
                            <input 
                                type="number" 
                                id="budget" 
                                name="budget" 
                                value={filters.budget}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="negotiationType">Tipo de negociación</label>
                            <select 
                                id="negotiationType" 
                                name="negotiationType" 
                                value={filters.negotiationType}
                                onChange={handleInputChange}
                            >
                                <option value="">Todos</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="propertyType">Tipo de propiedad</label>
                            <select 
                                id="propertyType" 
                                name="propertyType"
                                value={filters.propertyType}
                                onChange={handleInputChange}
                            >
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="terreno">Terreno</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="rooms">Habitaciones</label>
                            <input 
                                type="number" 
                                id="rooms" 
                                name="rooms" 
                                min="1" 
                                value={filters.rooms}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="apply-filters-button">Aplicar Filtros</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;