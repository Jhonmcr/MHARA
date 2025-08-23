import React from 'react';
import './Asesores.css';
import HeaderElements from '../../components/HeaderElements';
import AdvisorsCard from '../../components/AdvisorsCard';

const Asesores = () => {
    return (
        <div className="asesores-container">
            <HeaderElements />
            <main className="asesores-content">
                <h1>Nuestros Asesores</h1>
                <div className='ContentAdvisorCard'>
                    <AdvisorsCard />

                </div>
            </main>
        </div>
    );
};

export default Asesores;
