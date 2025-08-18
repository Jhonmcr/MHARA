import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Catalogo.css';
import MainHouseDisplay from '../../components/MainHouseDisplay';
import Sidebar from '../../components/Sidebar';
import HeaderElements from '../../components/HeaderElements'

const Catalogo = () => {
    // Get properties from the layout component (ProtectedRoutes)
    const { properties } = useOutletContext();
    
    const [selectedProperty, setSelectedProperty] = useState(null);

    // When properties are loaded or updated, select the first one by default
    useEffect(() => {
        if (properties && properties.length > 0) {
            setSelectedProperty(properties[0]);
        }
    }, [properties]);

    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
    };

    if (!properties) {
        return <div>Cargando propiedades...</div>;
    }

    return (
        <div className="catalogo-container">
            <div className="catalogo-main">
                <HeaderElements/>
                <MainHouseDisplay property={selectedProperty} />
                <Sidebar properties={properties} onSelectProperty={handleSelectProperty} />
            </div>
        </div>
    );
};

export default Catalogo;