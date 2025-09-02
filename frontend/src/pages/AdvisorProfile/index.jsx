import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
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
                const response = await apiClient.get(`/users/advisors/${id}`);
                setAdvisor(response.data);
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
            const response = await apiClient.post(`/advisors/${id}/contact`, formData);
            setAdvisor(response.data);
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
