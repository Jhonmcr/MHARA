import React from 'react';
import InputWithIcon from '../InputWithIcon';
import userIcon from '../../assets/icons/user_icon.png';
import lockIcon from '../../assets/icons/lock_icon.png';
import emailIcon from '../../assets/icons/email_icon.png';
import './RegistrationForm.css'; // Reutilizamos los estilos del login

const RegistrationForm = ({ onClose }) => {
    return (
        <div className="register-card"> {/* Usamos la misma clase que el LoginForm */}
            <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '1.5em' }}>Crear cuenta</h2>
            
            <InputWithIcon type="text" placeholder="Nombre y Apellido" icon={userIcon} />
            <InputWithIcon type="email" placeholder="Correo" icon={emailIcon} />
            <InputWithIcon type="text" placeholder="Nombre de Usuario" icon={userIcon} />
            <InputWithIcon type="password" placeholder="Contraseña" icon={lockIcon} />
            <InputWithIcon type="password" placeholder="Confirmar Contraseña" icon={lockIcon} />
            
            {/* Usamos la clase del botón de login para consistencia */}
            <button className="register-button">Crear Cuenta</button> 
            <a href="#" className="create-account-link" onClick={onClose}>
                ¿Ya tienes cuenta? Iniciar sesión
            </a>
        </div>
    );
};

export default RegistrationForm;