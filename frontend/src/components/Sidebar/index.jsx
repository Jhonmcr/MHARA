import React from 'react';
import PropertyCard from '../PropertyCard';
import styles from './Sidebar.module.css';

const Sidebar = ({ properties, onSelectProperty }) => {
    return (
        <div className={styles.sidebar}>
            {(properties || []).map(property => (
                <PropertyCard 
                key={property._id} 
                property={property} 
                onSelect={() => onSelectProperty(property)}
                />
            ))}
        </div>
    );
};

export default Sidebar;

