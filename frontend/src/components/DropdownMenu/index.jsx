import React from 'react';
import './DropdownMenu.css';
import { useAuth } from '../../context/AuthContext';

const DropdownMenu = ({ onUploadPropertyClick, onEditPropertyClick }) => {
    const { openPopup, user } = useAuth();

    const handleAddAdvisorClick = () => {
        openPopup('addAdvisor');
    };

    return (
        <div className="dropdown-menu">
            <ul>
                <li onClick={onUploadPropertyClick}>Subir Propiedad</li>
                <li onClick={onEditPropertyClick}>Editar Propiedad</li>
                {user && user.role === 'admin' && (
                    <li onClick={handleAddAdvisorClick}>Agregar Asesor</li>
                )}
            </ul>
        </div>
    );
};

export default DropdownMenu;

