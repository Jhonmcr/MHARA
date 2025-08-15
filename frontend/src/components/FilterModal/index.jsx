import React from 'react';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Filtros</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="filter-group">
                            <label htmlFor="location">Ubicación</label>
                            <input type="text" id="location" name="location" />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="budget">Presupuesto</label>
                            <input type="number" id="budget" name="budget" />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="negotiationType">Tipo de negociación</label>
                            <select id="negotiationType" name="negotiationType">
                                <option value="">Todos</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="propertyType">Tipo de propiedad</label>
                            <select id="propertyType" name="propertyType">
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="terreno">Terreno</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="rooms">Habitaciones</label>
                            <input type="number" id="rooms" name="rooms" min="1" />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="apply-filters-button">Aplicar Filtros</button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
