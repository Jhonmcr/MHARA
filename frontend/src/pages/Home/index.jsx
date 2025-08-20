import React, { useState } from 'react';
import Header from '../../components/Header';
import GlassmorphismButton from '../../components/GlassmorphismButton';
import ContactPanel from '../../components/ContactPanel';
import logo from '../../assets/icons/Logo.png';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    const [showContactInfo, setShowContactInfo] = useState(false);

    const handleContactClick = () => {
        setShowContactInfo(true);
    };

    const handleHomeClick = () => {
        setShowContactInfo(false);
    }

    return (
        <div className="home-container">
            <Header onContactClick={handleContactClick} onHomeClick={handleHomeClick} />

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