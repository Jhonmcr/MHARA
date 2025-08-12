import React from 'react';
import './InputWithIcon.css';

const InputWithIcon = ({ type, placeholder, icon }) => {
    return (
        <div className="input-container">
        <img src={icon} alt="icon" className="input-icon" />
        <input type={type} placeholder={placeholder} className="input-field" />
    </div>
    );
};

export default InputWithIcon;