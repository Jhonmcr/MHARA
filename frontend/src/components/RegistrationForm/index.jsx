import React, { useState, useEffect } from 'react';
import InputWithIcon from '../InputWithIcon';
import userIcon from '../../assets/icons/user_icon.png';
import lockIcon from '../../assets/icons/lock_icon.png';
import emailIcon from '../../assets/icons/email_icon.png';
import apiClient from '../../api/axios'; // Importar el cliente de API centralizado
import './RegistrationForm.css';

const RegistrationForm = ({ onClose }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para la carga

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !username || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);

        try {
            const requestBody = {
                fullName,
                email,
                username,
                password,
            };
            if (token) {
                requestBody.token = token;
            }

            // Usar el cliente de API centralizado. La URL es ahora relativa a la base /api/v1
            const response = await apiClient.post('/auth/register', requestBody);

            // El registro fue exitoso
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            console.log('Respuesta de registro:', response.data); // Log para depuración
            onClose(); // Cierra el formulario para mostrar el de login

        } catch (err) {
            // Manejo de errores de Axios
            if (err.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                setError(err.response.data.detail || 'Ocurrió un error durante el registro.');
                console.error('Error de datos de registro:', err.response.data);
            } else if (err.request) {
                // La solicitud se hizo pero no se recibió respuesta
                setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
                console.error('Error de red o solicitud:', err.request);
            } else {
                // Algo más causó el error
                setError('Ocurrió un error inesperado.');
                console.error('Error inesperado:', err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-card">
            <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '1.5em' }}>Crear cuenta</h2>
            
            <form onSubmit={handleSubmit}>
                <InputWithIcon 
                    type="text" 
                    placeholder="Nombre y Apellido" 
                    icon={userIcon}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <InputWithIcon 
                    type="email" 
                    placeholder="Correo" 
                    icon={emailIcon}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputWithIcon 
                    type="text" 
                    placeholder="Nombre de Usuario" 
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
                <InputWithIcon 
                    type="password" 
                    placeholder="Confirmar Contraseña" 
                    icon={lockIcon}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputWithIcon 
                    type="password" 
                    placeholder="Token de Administrador (Opcional)" 
                    icon={lockIcon}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                
                {error && <p className="error-message" style={{ color: '#d9534f', fontSize: '0.9em', marginTop: '10px' }}>{error}</p>}

                <button type="submit" className="register-button" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button> 
            </form>

            <a href="#" className="create-account-link" onClick={onClose}>
                ¿Ya tienes cuenta? Iniciar sesión
            </a>
        </div>
    );
};

export default RegistrationForm;