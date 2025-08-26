import React from 'react';
import './AdvisorContactPopup.css';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const AdvisorContactPopup = ({ advisor, onClose }) => {
    return (
        <div className="advisor-contact-popup-overlay" onClick={onClose}>
            <div className="advisor-contact-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="advisor-contact-popup-header">
                    <h2>Contacto del Asesor</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="advisor-contact-popup-body">
                    <div className="advisor-info">
                        <img src={advisor.profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`} alt={advisor.fullName} className="advisor-image" />
                        <h3>{advisor.fullName}</h3>
                    </div>
                    <div className="contact-details">
                        {advisor.contact?.phone && (
                            <a href={`https://wa.me/${advisor.contact.phone}`} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className="contact-icon" />
                                <span>{advisor.contact.phone}</span>
                            </a>
                        )}
                        {advisor.contact?.email && (
                            <a href={`mailto:${advisor.contact.email}`}>
                                <FaEnvelope className="contact-icon" />
                                <span>{advisor.contact.email}</span>
                            </a>
                        )}
                        {!advisor.contact?.phone && !advisor.contact?.email && (
                            <p>No hay información de contacto disponible.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvisorContactPopup;