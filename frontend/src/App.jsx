import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import './App.css';
import backgroundImage from './assets/images/background.jpg';

function App() {
    const [showRegistration, setShowRegistration] = useState(false);

    const appStyle = {
      backgroundImage: `url(${backgroundImage})`
    };

    return (
      <div className="App" style={appStyle}>
        <h1 className="main-title">Mhara Estate Home</h1>
        
        {showRegistration ? (
          <RegistrationForm onClose={() => setShowRegistration(false)} />
        ) : (
          <LoginForm onShowRegistration={() => setShowRegistration(true)} />
        )}

      </div>
    );
}

export default App;
