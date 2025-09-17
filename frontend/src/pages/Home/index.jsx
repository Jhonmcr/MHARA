import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import GlassmorphismButton from '../../components/GlassmorphismButton';
import ChangeProfilePicture from '../../components/ChangeProfilePicture';
import ContactPanel from '../../components/ContactPanel'; // Import ContactPanel
import UploadPropertyPopup from '../../components/popups/UploadPropertyPopup';
import EditPropertySelectionPopup from '../../components/popups/EditPropertySelectionPopup';
import logo from '../../assets/icons/Logo.png';
import './home.css';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHomePanel } from '../../context/HomePanelContext'; // Import the new hook

const Home = () => {
    const { user, setUser } = useAuth();
    const { panelContent, setPanelContent } = useHomePanel(); // Use the new context
    const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
    const [isEditSelectionPopupOpen, setEditSelectionPopupOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const location = useLocation();
    const { properties, refetchProperties } = useOutletContext();

    // Static contact info for the company
    const companyContact = {
        _id: 'company_contact',
        fullName: "Mhara Estate",
        profileImageUrl: logo,
        contactInfo: {
            instagram: "MharaEstate",
            phone: "+58 4242921532",
            email: "mharaestatehome@gmail.com",
            instagram: "https://www.instagram.com/mharaestatehome/#" 
        }
    };

    useEffect(() => {
        if (location.state?.scrollTo === 'contact') {
            setPanelContent(companyContact);
        }

        // Cleanup function to reset panel when leaving Home page
        return () => {
            setPanelContent('default');
        };
    }, [location.state, setPanelContent]);

    const handleContactClick = () => {
        setPanelContent(companyContact);
    };

    const handleHomeClick = () => {
        setPanelContent('default');
    };

    const handleShowChangeProfilePicture = () => {
        setPanelContent('profile');
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

    const renderPanelContent = () => {
        if (typeof panelContent === 'object' && panelContent !== null) {
            return <ContactPanel contactData={panelContent} />;
        }
        switch (panelContent) {
            case 'profile':
                return <ChangeProfilePicture user={user} setUser={setUser} />;
            case 'default':
            default:
                return (
                    <div className="logo-text-large">
                        <img src={logo} alt="Mhara Estate Home" className="logoHome" />
                    </div>
                );
        }
    };

    return (
        <div className="home-container">
            <Header 
                onContactClick={handleContactClick} 
                onHomeClick={handleHomeClick} 
                onUploadPropertyClick={handleUploadPropertyClick}
                onEditPropertyClick={handleEditPropertyClick}
                onShowChangeProfilePicture={handleShowChangeProfilePicture}
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
                    {renderPanelContent()}
                </div>

                {/* Panel de la derecha con botones */}
                <div className="main-buttons-panel">
                    <Link to="/catalogo" className='GlassmorphismButton1'>
                        <GlassmorphismButton text="Catalogo"/>
                    </Link>
                    <Link to="/nosotros" className='GlassmorphismButton2'>
                        <GlassmorphismButton text="Nosotros"/>
                    </Link>
                    <div className='GlassmorphismButton3' onClick={handleContactClick} style={{ cursor: 'pointer' }}>
                        <GlassmorphismButton text="Contactanos"/>
                    </div>
                    <Link to="/asesores" className='GlassmorphismButton4'>
                        <GlassmorphismButton text="Asesores"/>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;