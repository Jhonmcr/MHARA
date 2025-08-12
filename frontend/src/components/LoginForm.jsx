import React from 'react';
import InputWithIcon from './InputWithIcon';
import logo from '../assets/images/mhara_logo.png';
import userIcon from '../assets/icons/user_icon.png';
import lockIcon from '../assets/icons/lock_icon.png';
import './LoginForm.css';

const LoginForm = ({ onShowRegistration }) => {
    return (
        <div className="login-card">
        <img src={logo} alt="Mhara Estate Home" className="logo" />
        
        <InputWithIcon type="text" placeholder="usuario" icon={userIcon} />
        <InputWithIcon type="password" placeholder="Contraseña" icon={lockIcon} />

        <button className="login-button">Listo</button>
        <a href="#" className="create-account-link" onClick={onShowRegistration}>
            Crear cuenta
        </a>
        </div>
    );
};

export default LoginForm;