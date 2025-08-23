import React, { useState, useEffect } from 'react';
import './AddAdvisorForm.css';

const AddAdvisorForm = ({ onAddAdvisor }) => {
    const [username, setUsername] = useState('');
    const [advisorCode, setAdvisorCode] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isAdvisorAdded, setIsAdvisorAdded] = useState(false);

    useEffect(() => {
        if (username.trim() !== '' && advisorCode.trim() !== '') {
        setIsButtonDisabled(false);
        } else {
        setIsButtonDisabled(true);
        }
    }, [username, advisorCode]);

    const handleToggle = () => {
        if (isButtonDisabled) return;

        // This is a placeholder for the actual logic
        // In a real scenario, you would call the API here
        setIsAdvisorAdded(!isAdvisorAdded);

        if (!isAdvisorAdded) {
        console.log('Simulating adding advisor:', { username, advisorCode });
        if(onAddAdvisor) {
            onAddAdvisor({ username, advisorCode });
        }
        } else {
        console.log('Simulating removing advisor for:', username);
        // Logic to remove advisor would go here
        }
    };

    return (
        <form className="add-advisor-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej. juanperez"
            required
            />
        </div>
        <div className="input-group">
            <label htmlFor="advisorCode">Código Único de Asesor</label>
            <input
            type="text"
            id="advisorCode"
            value={advisorCode}
            onChange={(e) => setAdvisorCode(e.target.value)}
            placeholder="ej. JP123"
            required
            />
        </div>
        <div className="toggle-button-container">
            <button
            type="button"
            onClick={handleToggle}
            disabled={isButtonDisabled}
            className={`toggle-button ${isAdvisorAdded ? 'toggled' : ''}`}
            >
            <span className="toggle-button-text">
                {isAdvisorAdded ? 'Quitar Asesor' : 'Agregar Asesor'}
            </span>
            <div className="toggle-switch"></div>
            </button>
        </div>
        </form>
    );
};

export default AddAdvisorForm;
