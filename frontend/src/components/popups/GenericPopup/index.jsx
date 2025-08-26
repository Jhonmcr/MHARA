import React from 'react';
import ReactDOM from 'react-dom';
import './GenericPopup.css';

const GenericPopup = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="popup-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GenericPopup;

