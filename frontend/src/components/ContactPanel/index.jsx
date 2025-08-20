import React from 'react';
import './ContactPanel.css';
import { FaInstagram, FaTelegramPlane, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ContactPanel = () => {
    return (
        <div className="contact-panel">
            <h2>Contáctanos</h2>
            <div className="contact-info">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="contact-icon" />
                    <span>@MharaEstate</span>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                    <FaTelegramPlane className="contact-icon" />
                    <span>Mhara Estate</span>
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="contact-icon" />
                    <span>+123 456 7890</span>
                </a>
                <a href="mailto:info@mharaestate.com">
                    <FaEnvelope className="contact-icon" />
                    <span>info@mharaestate.com</span>
                </a>
            </div>
        </div>
    );
};

export default ContactPanel;
