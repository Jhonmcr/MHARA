import React from 'react';
import styles from './ContactPanel.module.css';
import { FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa';

// This is now a simple presentational component
const ContactPanel = ({ contactData }) => {
    if (!contactData) {
        return null;
    }

    const { fullName, profileImageUrl, contactInfo } = contactData;
    const image = profileImageUrl;

    return (
        <div className={styles.panel}>
            {image && <img src={image} alt={fullName} className={styles.advisorImage} />}
            <h3 className={styles.advisorName}>{fullName}</h3>
            
            <div className={styles.contactList}>
                {contactInfo?.phone && (
                    <a href={`tel:${contactInfo.phone}`} className={styles.contactItem}>
                        <FaPhone /> <span>{contactInfo.phone}</span>
                    </a>
                )}
                {contactInfo?.email && (
                    <a href={`mailto:${contactInfo.email}`} className={styles.contactItem}>
                        <FaEnvelope /> <span>{contactInfo.email}</span>
                    </a>
                )}
                {contactInfo?.instagram && (
                    <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                        <FaInstagram /> <span>@{contactInfo.instagram}</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default ContactPanel;