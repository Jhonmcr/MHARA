import React from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';
// import teamImage from '../../assets/team.jpg';

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <header className="about-us-header">
                <div className="header-left">
                    <h1><Link to="/">MHARA ESTATE HOME</Link></h1>
                </div>
                <nav className="header-right">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/asesores">Asesores</Link></li>
                        <li><Link to="/contactanos">Contactanos</Link></li>
                        <li><Link to="/catalogo">Catalogo</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="about-us-content">
                <div className="content-left">
                    {/* Aquí va la imagen del equipo */}
                    {/* <img src={teamImage} alt="Equipo" className="team-image" /> */}
                </div>
                <div className="content-right">
                    <div className="about-us-title">
                        <h2>About <span className="yellow-line">Us</span></h2>
                    </div>
                    <div className="about-us-text">
                        <p>
                            We believe every brand has a unique narrative that deserves to be told. Our vision is to empower businesses
                            to express their identity and connect with their audience through compelling design and strategic marketing.
                        </p>
                        <p>
                            Our mission is to provide impactful creative solutions tailored to each client's needs. We aim to build long-lasting partnerships through collaboration, innovation, and a commitment to excellence.
                        </p>
                        <p>
                            Our mission is to provide impactful creative solutions tailored to each client's needs. We aim to build long-lasting partnerships through collaboration, innovation, and a commitment to excellence.
                        </p>
                    </div>
                    <div className="quote-mark">
                        “
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutUs;