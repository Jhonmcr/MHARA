import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import RegistrationForm from '../../components/RegistrationForm';
import '../../App.css'; // We can reuse the main App css for the background and layout
import backgroundImage from '../../assets/images/background2.png';

const LoginPage = () => {
    const [showRegistration, setShowRegistration] = useState(false);

    const appStyle = {
      backgroundImage: `url(${backgroundImage})`
    };

    return (
      <div className="App" style={appStyle}>
        <h1 className="main-title">Mhara Estate Home</h1>

        <div className="form-container">
            <div className={`form-wrapper ${!showRegistration ? 'active' : 'inactive-left'}`}>
                <LoginForm onShowRegistration={() => setShowRegistration(true)} />
            </div>
            <div className={`form-wrapper ${showRegistration ? 'active' : 'inactive-right'}`}>
                <RegistrationForm onClose={() => setShowRegistration(false)} />
            </div>
        </div>

      </div>
    );
}

export default LoginPage;
