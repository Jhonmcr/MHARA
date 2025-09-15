import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/axios'; // Importar el cliente API centralizado
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

        try {
            // Usar el cliente API centralizado. La URL base ya está configurada.
            const response = await apiClient.post('/auth/login', {
                username,
                password,
            });

            // Con axios, una respuesta exitosa (2xx) va directamente aquí.
            // Los datos de la respuesta están en `response.data`.
            login(response.data); // Pasar los datos de la API al contexto
            navigate('/home'); // Redirige al home

        } catch (err) {
            // axios lanza un error para respuestas no exitosas (4xx, 5xx).
            if (err.response) {
                // El servidor respondió con un estado de error
                setError(err.response.data.detail || 'Usuario o contraseña incorrectos.');
            } else if (err.request) {
                // La petición se hizo pero no se recibió respuesta
                setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            } else {
                // Algo más causó el error
                setError('Ocurrió un error inesperado.');
            }
            console.error('Error de inicio de sesión:', err);
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
                    autoComplete="username"
                />
                <InputWithIcon
                    type="password"
                    placeholder="Contraseña"
                    icon={lockIcon}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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