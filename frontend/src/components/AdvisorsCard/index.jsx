import React from 'react';
import styles from './AdvisorCard.module.css';
import { FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa';

const AdvisorCard = ({ advisor }) => {
    const { fullName, profileImageUrl, testimonial, contactInfo } = advisor;

    const image = profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`;

    return (
        <div className={styles.card}>
            <img src={image} alt={fullName} className={styles.advisorImage} />
            <h3 className={styles.advisorName}>{fullName}</h3>
            <p className={styles.testimonial}>{testimonial || 'Asesor experto en bienes raíces.'}</p>
            <div className={styles.contactContainer}>
                {contactInfo?.phone && (
                    <a href={`tel:${contactInfo.phone}`} className={styles.contactLink}>
                        <FaPhone /> <span>{contactInfo.phone}</span>
                    </a>
                )}
                {contactInfo?.email && (
                    <a href={`mailto:${contactInfo.email}`} className={styles.contactLink}>
                        <FaEnvelope /> <span>{contactInfo.email}</span>
                    </a>
                )}
                {contactInfo?.instagram && (
                    <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                        <FaInstagram /> <span>@{contactInfo.instagram}</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default AdvisorCard;