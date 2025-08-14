import React from 'react';
import './GlassmorphismButton.css';

const GlassmorphismButton = ({ text, onClick }) => {
    return (
        <button className="glassmorphism-button" onClick={onClick}>
        {text}
        </button>
    );
};

export default GlassmorphismButton;