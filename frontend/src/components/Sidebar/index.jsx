import React from 'react';
import PropertyCard from '../PropertyCard';
import PropertyCardSkeleton from '../PropertyCardSkeleton';
import styles from './Sidebar.module.css';

const Sidebar = ({ properties, onSelectProperty, viewMode }) => {
    const isLoading = properties === null;
    const noProperties = properties && properties.length === 0;

    return (
        <div className={styles.sidebar}>
            {isLoading || noProperties ? (
                [...Array(10)].map((_, index) => <PropertyCardSkeleton key={index} />)
            ) : (
                properties.map(property => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        onSelect={onSelectProperty}
                        viewMode={viewMode}
                    />
                ))
            )}
        </div>
    );
};

export default Sidebar;