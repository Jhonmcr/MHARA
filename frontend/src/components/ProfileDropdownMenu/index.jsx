import React from 'react';
import './ProfileDropdownMenu.css';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdownMenu = ({
    onChangeProfilePicture,
    onChangeUsername,
    onChangePassword,
    onAddContactInfo,
    onLogout,
}) => {
    const { user } = useAuth();

    return (
        <div className="profile-dropdown-menu">
            <ul>
                <li onClick={onChangeProfilePicture}>Cambiar foto de perfil</li>
                <li onClick={onChangeUsername}>Cambiar nombre de usuario</li>
                <li onClick={onChangePassword}>Cambiar contraseña</li>
                {user && user.role === 'asesor' && (
                    <li onClick={onAddContactInfo}>Agregar datos de contacto</li>
                )}
                <li onClick={onLogout}>Cerrar sesión</li>
            </ul>
        </div>
    );
};

export default ProfileDropdownMenu;
