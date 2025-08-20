import React from 'react';
import styles from './PropertyCardSkeleton.module.css';

const PropertyCardSkeleton = () => {
    return (
        <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonImage} ${styles.shimmer}`}></div>
            <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonText} ${styles.title} ${styles.shimmer}`}></div>
                <div className={`${styles.skeletonText} ${styles.subtitle} ${styles.shimmer}`}></div>
            </div>
        </div>
    );
};

export default PropertyCardSkeleton;
