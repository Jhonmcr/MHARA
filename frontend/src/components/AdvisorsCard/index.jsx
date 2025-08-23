import React from 'react';
import styles from './AdvisorCard.module.css';

const AdvisorCard = ({ name, image, testimonial }) => {
    return (
        <div className={styles.card}>
        <img src={image} alt={name} className={styles.advisorImage} />
        <h3 className={styles.advisorName}>{name}</h3>
        <p className={styles.testimonial}>{testimonial}</p>
        </div>
    );
};

export default AdvisorCard;