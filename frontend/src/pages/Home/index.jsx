import React from 'react';
import Header from '../../components/Header';
import GlassmorphismButton from '../../components/GlassmorphismButton';
import logo from '../../assets/icons/Logo.png';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <Header />

            <main className="main-content">
                {/* Panel de la izquierda con el logo */}
                <div className="main-logo-panel glassmorphism-panel">
                    <div className="logo-text-large">
                        <img src={logo} alt="Mhara Estate Home" className="logoHome" />
                    </div>
                </div>

                {/* Panel de la derecha con botones */}
                <div className="main-buttons-panel">
                    <Link to="/catalogo">
                        <GlassmorphismButton text="Catalogo" />
                    </Link>
                    <Link to="/nosotros">
                        <GlassmorphismButton text="Nosotros" />
                    </Link>
                    <Link to="/contactanos">
                        <GlassmorphismButton text="Contactanos" />
                    </Link>
                    <Link to="/asesores">
                        <GlassmorphismButton text="Asesores" />
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;