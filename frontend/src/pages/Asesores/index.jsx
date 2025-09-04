import React, { useState, useEffect } from 'react';
import './Asesores.css';
import HeaderElements from '../../components/HeaderElements';
import AdvisorsCard from '../../components/AdvisorsCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import userIcon from '../../assets/icons/usuario.png'; // Importar el ícono
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/axios'; // Importar el cliente de API centralizado

const Asesores = () => {
    const [advisors, setAdvisors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Estado para la carga
    const { refetchTrigger } = useAuth();

    useEffect(() => {
        const fetchAdvisors = async () => {
            setLoading(true);
            try {
                // Se utiliza el apiClient para una llamada de API consistente
                const response = await apiClient.get('/users/advisors');
                setAdvisors(response.data); // Axios devuelve los datos en la propiedad 'data'
            } catch (error) {
                console.error("Error fetching advisors:", error);
                setAdvisors([]); // Asegurarse de que advisors esté vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchAdvisors();
    }, [refetchTrigger]);

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
                    advisor={{
                        _id: `placeholder-${index}`,
                        fullName: "Asesor no disponible",
                        profileImageUrl: userIcon,
                        testimonial: "Próximamente, más asesores estarán disponibles para ayudarte.",
                        contactInfo: {}
                    }}
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
                advisor={advisor}
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