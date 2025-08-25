import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import GlassmorphismButton from '../../components/GlassmorphismButton';
import ContactPanel from '../../components/ContactPanel';
import UploadPropertyPopup from '../../components/popups/UploadPropertyPopup';
import EditPropertySelectionPopup from '../../components/popups/EditPropertySelectionPopup';
import logo from '../../assets/icons/Logo.png';
import './home.css';
import { Link, useLocation, useOutletContext } from 'react-router-dom';

const Home = () => {
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
    const [isEditSelectionPopupOpen, setEditSelectionPopupOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const location = useLocation();
    const { properties, refetchProperties } = useOutletContext();

    useEffect(() => {
        if (location.state?.scrollTo === 'contact') {
            setShowContactInfo(true);
        }
    }, [location]);

    const handleContactClick = () => {
        setShowContactInfo(true);
    };

    const handleHomeClick = () => {
        setShowContactInfo(false);
    };

    const handleUploadPropertyClick = () => {
        setPropertyToEdit(null);
        setUploadPopupOpen(true);
    };

    const handleEditPropertyClick = () => {
        setEditSelectionPopupOpen(true);
    };

    const handleClosePopups = () => {
        setUploadPopupOpen(false);
        setEditSelectionPopupOpen(false);
        setPropertyToEdit(null);
    };

    const handlePropertySelectForEdit = (property) => {
        setPropertyToEdit(property);
        setEditSelectionPopupOpen(false);
        setUploadPopupOpen(true);
    };
    
    const handlePropertyPublished = (data) => {
        console.log('Propiedad publicada/actualizada:', data);
        if (refetchProperties) {
            refetchProperties();
        }
    };


    return (
        <div className="home-container">
            <Header 
                onContactClick={handleContactClick} 
                onHomeClick={handleHomeClick} 
                onUploadPropertyClick={handleUploadPropertyClick}
                onEditPropertyClick={handleEditPropertyClick}
            />

            {isUploadPopupOpen && (
                <UploadPropertyPopup 
                    onClose={handleClosePopups}
                    onPublish={handlePropertyPublished}
                    propertyToEdit={propertyToEdit}
                />
            )}

            {isEditSelectionPopupOpen && (
                <EditPropertySelectionPopup
                    properties={properties || []}
                    onClose={handleClosePopups}
                    onSelectProperty={handlePropertySelectForEdit}
                />
            )}

            <main className="main-content">
                {/* Panel de la izquierda con el logo */}
                <div className="main-logo-panel glassmorphism-panel">
                    {showContactInfo ? (
                        <ContactPanel />
                    ) : (
                        <div className="logo-text-large">
                            <img src={logo} alt="Mhara Estate Home" className="logoHome" />
                        </div>
                    )}
                </div>

                {/* Panel de la derecha con botones */}
                <div className="main-buttons-panel">
                    <Link to="/catalogo">
                        <GlassmorphismButton text="Catalogo" />
                    </Link>
                    <Link to="/nosotros">
                        <GlassmorphismButton text="Nosotros" />
                    </Link>
                    <div onClick={handleContactClick} style={{ cursor: 'pointer' }}>
                        <GlassmorphismButton text="Contactanos" />
                    </div>
                    <Link to="/asesores">
                        <GlassmorphismButton text="Asesores" />
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;