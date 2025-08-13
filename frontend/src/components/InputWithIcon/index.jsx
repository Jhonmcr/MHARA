import React from 'react';
import './InputWithIcon.css';

const InputWithIcon = ({ type, placeholder, icon, value, onChange }) => {
    return (
        <div className="input-container">
            <img src={icon} alt="icon" className="input-icon" />
            <input
                type={type}
                placeholder={placeholder}
                className="input-field"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default InputWithIcon;