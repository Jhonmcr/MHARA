import React from 'react';
import styles from './MainHouseDisplaySkeleton.module.css';

const MainHouseDisplaySkeleton = () => {
    return (
        <div className={styles.container}>
            <div className={`${styles.imageContainer} ${styles.shimmer}`}></div>
            <div className={styles.detailsContainer}>
                <div className={styles.info}>
                    <div className={`${styles.skeletonText} ${styles.title} ${styles.shimmer}`}></div>
                    <div className={styles.specs}>
                        <div className={`${styles.skeletonText} ${styles.specItem} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonText} ${styles.specItem} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonText} ${styles.specItem} ${styles.shimmer}`}></div>
                    </div>
                    <div className={`${styles.skeletonText} ${styles.price} ${styles.shimmer}`}></div>
                </div>
                <div className={styles.contact}>
                    <div className={`${styles.profileIcon} ${styles.shimmer}`}></div>
                    <div className={`${styles.contactButton} ${styles.shimmer}`}></div>
                </div>
            </div>
        </div>
    );
};

export default MainHouseDisplaySkeleton;
