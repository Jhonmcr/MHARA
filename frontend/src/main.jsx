import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { HomePanelProvider } from './context/HomePanelContext';
import { LoadingProvider } from './context/LoadingContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <FavoritesProvider>
            <HomePanelProvider>
              <App />
            </HomePanelProvider>
          </FavoritesProvider>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
