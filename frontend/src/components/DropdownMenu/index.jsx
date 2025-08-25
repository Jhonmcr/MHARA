import React from 'react';
import './DropdownMenu.css';
import { useAuth } from '../../context/AuthContext';

const DropdownMenu = ({ onUploadPropertyClick, onEditPropertyClick }) => {
    const { openPopup } = useAuth();

    const handleAddAdvisorClick = () => {
        openPopup('addAdvisor');
    };

    const handleSettingsClick = () => {
        console.log("Settings clicked");
    };

    return (
        <div className="dropdown-menu">
            <ul>
                <li onClick={onUploadPropertyClick}>Subir Propiedad</li>
                <li onClick={onEditPropertyClick}>Editar Propiedad</li>
                <li onClick={handleAddAdvisorClick}>Agregar Asesor</li>
                <li onClick={handleSettingsClick}>Ajustes</li>
            </ul>
        </div>
    );
};

export default DropdownMenu;

