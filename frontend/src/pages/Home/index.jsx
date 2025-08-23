import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import GlassmorphismButton from '../../components/GlassmorphismButton';
import ContactPanel from '../../components/ContactPanel';
import UploadPropertyPopup from '../../components/popups/UploadPropertyPopup'; // 1. Importar
import logo from '../../assets/icons/Logo.png';
import './home.css';
import { Link, useLocation, useOutletContext } from 'react-router-dom';

const Home = () => {
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
    const location = useLocation();
    const { refetchProperties } = useOutletContext(); // Get the refetch function

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

    // 3. Handlers para el popup
    const handleUploadPropertyClick = () => {
        setUploadPopupOpen(true);
    };

    const handleClosePopup = () => {
        setUploadPopupOpen(false);
    };
    
    const handlePropertyPublished = (data) => {
        console.log('Propiedad publicada:', data);
        if (refetchProperties) {
            refetchProperties();
        }
    };


    return (
        <div className="home-container">
            {/* 4. Pasar el handler al Header */}
            <Header 
                onContactClick={handleContactClick} 
                onHomeClick={handleHomeClick} 
                onUploadPropertyClick={handleUploadPropertyClick} 
            />

            {/* 5. Renderizar el popup condicionalmente */}
            {isUploadPopupOpen && (
                <UploadPropertyPopup 
                    onClose={handleClosePopup}
                    onPublish={handlePropertyPublished}
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