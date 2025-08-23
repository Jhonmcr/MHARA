import React from 'react';
import './DropdownMenu.css';
import { useAuth } from '../../context/AuthContext';

const DropdownMenu = ({ onUploadPropertyClick }) => {
    const { openPopup } = useAuth();

    const handleAddAdvisorClick = () => {
        // This will open the popup managed by AuthContext
        openPopup('addAdvisor');
    };

    // We can also create handlers for other options in the future
    const handleEditPropertyClick = () => {
        // openPopup('editProperty');
        console.log("Edit Property clicked");
    };

    const handleSettingsClick = () => {
        // openPopup('settings');
        console.log("Settings clicked");
    };

    return (
        <div className="dropdown-menu">
            <ul>
                <li onClick={onUploadPropertyClick}>Subir Propiedad</li>
                <li onClick={handleEditPropertyClick}>Editar Propiedad</li>
                <li onClick={handleAddAdvisorClick}>Agregar Asesor</li>
                <li onClick={handleSettingsClick}>Ajustes</li>
            </ul>
        </div>
    );
};

export default DropdownMenu;
