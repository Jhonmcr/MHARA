import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputWithIcon from '../InputWithIcon';
import logo from '../../assets/images/mhara_logo.png';
import userIcon from '../../assets/icons/user_icon.png';
import lockIcon from '../../assets/icons/lock_icon.png';
import './LoginForm.css';

const LoginForm = ({ onShowRegistration }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // --- 2. Añadir este bloque useEffect ---
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000); // 5 segundos

            // Limpiar el temporizador si el componente se desmonta o el error cambia
            return () => clearTimeout(timer);
        }
    }, [error]);
    // ------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!username || !password) {
            setError('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

        if (username === 'admin' && password === 'password') {
            console.log('Login successful');
            login(); // Update the auth context
            navigate('/home'); // Redirect to home
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="login-card">
            <div className='logo-card'>
                <img src={logo} alt="Mhara Estate Home" className="logo" />
            </div>

            <form onSubmit={handleSubmit}>
                <InputWithIcon
                    type="text"
                    placeholder="usuario"
                    icon={userIcon}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputWithIcon
                    type="password"
                    placeholder="Contraseña"
                    icon={lockIcon}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="login-button">Ingresar</button>
            </form>

            <a href="#" className="create-account-link" onClick={onShowRegistration}>
                Crear cuenta
            </a>
        </div>
    );
};

export default LoginForm;