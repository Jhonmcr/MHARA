import React from 'react';
import './AdvisorContactPopup.css';
import { FaWhatsapp, FaEnvelope, FaInstagram } from 'react-icons/fa';

const AdvisorContactPopup = ({ advisor, onClose }) => {
    const hasContactInfo = advisor.contactInfo?.phone || advisor.contactInfo?.email || advisor.contactInfo?.instagram;

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
                        {advisor.contactInfo?.phone && (
                            <a href={`https://wa.me/${advisor.contactInfo.phone}`} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className="contact-icon" />
                                <span>{advisor.contactInfo.phone}</span>
                            </a>
                        )}
                        {advisor.contactInfo?.email && (
                            <a href={`mailto:${advisor.contactInfo.email}`}>
                                <FaEnvelope className="contact-icon" />
                                <span>{advisor.contactInfo.email}</span>
                            </a>
                        )}
                        {advisor.contactInfo?.instagram && (
                            <a href={`https://www.instagram.com/${advisor.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="contact-icon" />
                                <span>{advisor.contactInfo.instagram}</span>
                            </a>
                        )}
                        {!hasContactInfo && (
                            <p>No hay información de contacto disponible.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvisorContactPopup;