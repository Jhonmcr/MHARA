import React from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';
import teamImage from '../../assets/images/imageAboutUs.png';
import HeaderElements from '../../components/HeaderElements';

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <HeaderElements/>
            <main className="about-us-content">
                <div className="content-left">
                    <img src={teamImage} alt="Equipo" className="team-image" />
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