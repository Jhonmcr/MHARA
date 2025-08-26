import React from 'react';
import styles from './AdvisorCard.module.css';

const AdvisorCard = ({ advisor }) => {
    const { fullName, profileImageUrl, testimonial, contactInfo } = advisor;

    const image = profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`;

    return (
        <div className={styles.card}>
            <img src={image} alt={fullName} className={styles.advisorImage} />
            <h3 className={styles.advisorName}>{fullName}</h3>
            <p className={styles.testimonial}>{testimonial || 'Asesor experto en bienes raíces.'}</p>
            <div className={styles.contactIcons}>
                {contactInfo?.phone && (
                    <a href={`tel:${contactInfo.phone}`} title={contactInfo.phone}>
                        <img src="https://www.gstatic.com/images/icons/material/system/2x/phone_black_24dp.png" alt="Phone" />
                    </a>
                )}
                {contactInfo?.email && (
                    <a href={`mailto:${contactInfo.email}`} title={contactInfo.email}>
                        <img src="https://www.gstatic.com/images/icons/material/system/2x/email_black_24dp.png" alt="Email" />
                    </a>
                )}
                {contactInfo?.instagram && (
                    <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" title={contactInfo.instagram}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" />
                    </a>
                )}
                {contactInfo?.tiktok && (
                    <a href={`https://tiktok.com/@${contactInfo.tiktok}`} target="_blank" rel="noopener noreferrer" title={contactInfo.tiktok}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/96px-Tiktok_icon.svg.png" alt="TikTok" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default AdvisorCard;