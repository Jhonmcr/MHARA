import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AdvisorProfile.css';
import HeaderElements from '../../components/HeaderElements';
import AdvisorContactForm from '../../components/AdvisorContactForm';

const AdvisorProfile = () => {
    const { id } = useParams();
    const [advisor, setAdvisor] = useState(null);
    const [isContactFormOpen, setIsContactFormOpen] = useState(false);

    useEffect(() => {
        const fetchAdvisor = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/users/advisors/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAdvisor(data);
            } catch (error) {
                console.error("Error fetching advisor:", error);
            }
        };

        fetchAdvisor();
    }, [id]);

    const handleOpenContactForm = () => {
        setIsContactFormOpen(true);
    };

    const handleCloseContactForm = () => {
        setIsContactFormOpen(false);
    };

    const handleContactFormSubmit = async (formData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/advisors/${id}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedAdvisor = await response.json();
            setAdvisor(updatedAdvisor);
            setIsContactFormOpen(false);
        } catch (error) {
            console.error('Error updating contact info:', error);
        }
    };

    if (!advisor) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="advisor-profile-container">
            <HeaderElements />
            <div className="advisor-profile-content">
                <div className="advisor-profile-header">
                    <img src={advisor.profileImageUrl || `https://i.pravatar.cc/150?u=${advisor._id}`} alt={advisor.fullName} className="advisor-profile-image" />
                    <h1>{advisor.fullName}</h1>
                </div>
                <div className="advisor-profile-details">
                    <p>{advisor.testimonial || 'Asesor experto en bienes raíces.'}</p>
                    <button onClick={handleOpenContactForm} className="edit-contact-button">
                        Editar Información de Contacto
                    </button>
                </div>
            </div>
            {isContactFormOpen && (
                <AdvisorContactForm
                    advisor={advisor}
                    onClose={handleCloseContactForm}
                    onSubmit={handleContactFormSubmit}
                />
            )}
        </div>
    );
};

export default AdvisorProfile;
