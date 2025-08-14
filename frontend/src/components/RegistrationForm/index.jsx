import React, { useState, useEffect } from 'react';
import InputWithIcon from '../InputWithIcon';
import userIcon from '../../assets/icons/user_icon.png';
import lockIcon from '../../assets/icons/lock_icon.png';
import emailIcon from '../../assets/icons/email_icon.png';
import './RegistrationForm.css';

const RegistrationForm = ({ onClose }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000); // 5 segundos
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // --- Lógica de Validación ---
        if (!fullName || !email || !username || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    username,
                    password,
                }),
            });

            if (response.ok) {
                // El registro fue exitoso
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                onClose(); // Cierra el formulario para mostrar el de login
            } else {
                // El servidor devolvió un error
                const errorData = await response.json();
                setError(errorData.detail || 'Ocurrió un error durante el registro.');
            }
        } catch (error) {
            // Error de red o algo impidió la comunicación con la API
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            console.error('Error de registro:', error);
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
                
                {/* Reutilizamos la clase de error del login, si no existe, el estilo inline funcionará */}
                {error && <p className="error-message" style={{ color: '#d9534f', fontSize: '0.9em', marginTop: '10px' }}>{error}</p>}

                <button type="submit" className="register-button">Crear Cuenta</button> 
            </form>

            <a href="#" className="create-account-link" onClick={onClose}>
                ¿Ya tienes cuenta? Iniciar sesión
            </a>
        </div>
    );
};

export default RegistrationForm;