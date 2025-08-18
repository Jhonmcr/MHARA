import React from 'react';
import PropertyCard from '../PropertyCard';

const Sidebar = ({ properties, onSelectProperty }) => {
    return (
        <div className="sidebar">
        {properties.map(property => (
            <PropertyCard 
            key={property.id} 
            property={property} 
            onSelect={() => onSelectProperty(property)}
            />
        ))}
        </div>
    );
};

export default Sidebar;
