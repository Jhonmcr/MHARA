import React from 'react';
import './DropdownMenu.css'; // Assuming we will create this CSS file

const DropdownMenu = ({ onUploadPropertyClick }) => {
    return (
        <div className="dropdown-menu">
        <ul>
            <li onClick={onUploadPropertyClick}>Subir Propiedad</li>
            <li>Editar Propiedad</li>
            <li>Agregar Asesor</li>
            <li>Ajustes</li>
        </ul>
        </div>
    );
};

export default DropdownMenu;
