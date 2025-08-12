import React from 'react';
import InputWithIcon from './InputWithIcon';
import userIcon from '../assets/icons/user_icon.png';
import lockIcon from '../assets/icons/lock_icon.png';
import emailIcon from '../assets/icons/email_icon.png';
import './RegistrationForm.css';

const RegistrationForm = ({ onClose }) => {
    return (
        <div className="popup-container">
        <div className="popup-card">
            <h2>Crear cuenta</h2>
            
            <InputWithIcon type="text" placeholder="Nombre y Apellido" icon={userIcon} />
            <InputWithIcon type="email" placeholder="Correo" icon={emailIcon} />
            <InputWithIcon type="text" placeholder="Nombre de Usuario" icon={userIcon} />
            <InputWithIcon type="password" placeholder="Contraseña" icon={lockIcon} />
            <InputWithIcon type="password" placeholder="Confirmar Contraseña" icon={lockIcon} />
            
            <button className="register-button">Listo</button>
            {/* Este enlace llama a la función `onClose` para esconder el popup */}
            <a href="#" className="login-link" onClick={onClose}>Iniciar sesión</a>
        </div>
        </div>
    );
};

export default RegistrationForm;