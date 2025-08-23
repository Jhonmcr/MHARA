import React, { useState, useEffect } from 'react';
import './Asesores.css';
import HeaderElements from '../../components/HeaderElements';
import AdvisorsCard from '../../components/AdvisorsCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import userIcon from '../../assets/icons/usuario.png'; // Importar el ícono

const Asesores = () => {
    const [advisors, setAdvisors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Estado para la carga

    useEffect(() => {
        const fetchAdvisors = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/v1/users/advisors');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAdvisors(data);
            } catch (error) {
                console.error("Error fetching advisors:", error);
                setAdvisors([]); // Asegurarse de que advisors esté vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchAdvisors();
    }, []);

    const nextAdvisor = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % advisors.length);
    };

    const prevAdvisor = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + advisors.length) % advisors.length);
    };

    const renderSliderContent = () => {
        if (loading) {
            return <p>Cargando asesores...</p>;
        }

        if (advisors.length === 0) {
            // Mostrar 3 tarjetas de marcador de posición
            return Array.from({ length: 3 }).map((_, index) => (
                <AdvisorsCard
                    key={`placeholder-${index}`}
                    name="Asesor no disponible"
                    image={userIcon}
                    testimonial="Próximamente, más asesores estarán disponibles para ayudarte."
                />
            ));
        }
        
        let advisorsToShow = [];
        if (advisors.length <= 3) {
            advisorsToShow = advisors;
        } else {
            advisorsToShow = [
                advisors[currentIndex],
                advisors[(currentIndex + 1) % advisors.length],
                advisors[(currentIndex + 2) % advisors.length]
            ];
        }

        return advisorsToShow.map((advisor) => (
            <AdvisorsCard
                key={advisor._id}
                name={advisor.fullName}
                image={advisor.profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`}
                testimonial={advisor.testimonial || 'Asesor experto en bienes raíces.'}
            />
        ));
    };

    return (
        <div className="asesores-container">
            <HeaderElements />
            <main className="asesores-content">
                <h1 data-testid="asesores-heading">Nuestros Asesores</h1>
                <div className="slider-container">
                    {advisors.length > 3 && (
                        <button onClick={prevAdvisor} className="slider-button prev-button">
                            <FaArrowLeft />
                        </button>
                    )}
                    <div className='ContentAdvisorCard'>
                        {renderSliderContent()}
                    </div>
                    {advisors.length > 3 && (
                        <button onClick={nextAdvisor} className="slider-button next-button">
                            <FaArrowRight />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Asesores;
