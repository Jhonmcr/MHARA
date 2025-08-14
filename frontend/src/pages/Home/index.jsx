import React from 'react';
import Header from '../../components/Header';
import GlassmorphismButton from '../../components/GlassmorphismButton';
import './Home.css';
// import logoLarge from '../../assets/logo-large.png'; // Asegúrate de tener esta imagen en src/assets

const Home = () => {
    return (
        <div className="home-container">
        <Header />

        <main className="main-content">
            {/* Panel de la izquierda con el logo */}
            <div className="main-logo-panel glassmorphism-panel">
            {/* Si usas una imagen, descomenta la siguiente línea */}
            {/* <img src={logoLarge} alt="MHARA Estate Home" className="logo-large-img" /> */}
            <div className="logo-text-large">
                <img src={logo} alt="Mhara Estate Home" className="home-logo" />
            </div>
            </div>
            
            {/* Panel de la derecha con botones */}
            <div className="main-buttons-panel">
                <GlassmorphismButton text="Catalogo" onClick={() => console.log('Ir a Catálogo')} />
                <GlassmorphismButton text="Asesores" onClick={() => console.log('Ir a Asesores')} />
                <GlassmorphismButton text="Contactanos" onClick={() => console.log('Ir a Contactanos')} />
                <GlassmorphismButton text="Nosotros" onClick={() => console.log('Ir a Nosotros')} />
            </div>
        </main>
        </div>
    );
};

export default Home;