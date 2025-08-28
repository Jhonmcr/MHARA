import React from 'react';
import './LoadingSpinner.css';
import logo from '../../assets/images/mhara_logo.png';

const LoadingSpinner = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner-container">
                <img src={logo} alt="Cargando..." className="spinner-logo" />
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
