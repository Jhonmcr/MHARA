import React from 'react';
import './LogoutConfirmationPopup.css';

const LogoutConfirmationPopup = ({ onConfirm, onCancel }) => {
    return (
        <div className="logout-confirmation-overlay">
            <div className="logout-confirmation-content">
                <h2>Confirmar Cierre de Sesión</h2>
                <p>¿Estás seguro de que quieres cerrar sesión?</p>
                <div className="confirmation-actions">
                    <button onClick={onCancel} className="cancel-button">Cancelar</button>
                    <button onClick={onConfirm} className="confirm-button">Cerrar Sesión</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationPopup;
