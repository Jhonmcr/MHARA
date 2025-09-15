import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import './Header.css';
import logoSmall from '../../assets/images/mhara_logo.png';
import iconShoping from '../../assets/icons/shoping.png';
import iconUser from '../../assets/icons/user.png';
import DropdownMenu from '../DropdownMenu';
import ProfileDropdownMenu from '../ProfileDropdownMenu';
import FavoritesPopup from '../popups/FavoritesPopup';
import ChangeUsername from '../ChangeUsername';
import ChangePassword from '../ChangePassword';
import AdvisorContactForm from '../AdvisorContactForm';
import LogoutConfirmationPopup from '../LogoutConfirmationPopup';

const Header = ({ onUploadPropertyClick, onEditPropertyClick, onContactClick, onHomeClick, onShowChangeProfilePicture }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isAdvisorContactFormOpen, setIsAdvisorContactFormOpen] = useState(false);
    const [isLogoutPopupOpen, setLogoutPopupOpen] = useState(false);
    const { user, logout } = useAuth();
    const { favoriteProperties } = useFavorites();
    const navigate = useNavigate();

    const closeAllPopups = () => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsFavoritesOpen(false);
        setIsChangeUsernameOpen(false);
        setIsChangePasswordOpen(false);
        setIsAdvisorContactFormOpen(false);
        setLogoutPopupOpen(false);
    };

    const toggleMenu = () => {
        const wasOpen = isMenuOpen;
        closeAllPopups();
        setIsMenuOpen(!wasOpen);
    };

    const toggleProfileMenu = () => {
        const wasOpen = isProfileMenuOpen;
        closeAllPopups();
        setIsProfileMenuOpen(!wasOpen);
    };

    const toggleFavorites = () => {
        const wasOpen = isFavoritesOpen;
        closeAllPopups();
        setIsFavoritesOpen(!wasOpen);
    };

    const handleSelectFavorite = (property) => {
        toggleFavorites();
        navigate('/catalogo', { state: { selectedPropertyId: property.id } });
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        if(onContactClick) {
            onContactClick();
        }
    }

    const handleHomeClick = (e) => {
        e.preventDefault();
        if(onHomeClick) {
            onHomeClick();
        }
    }
    
    const shouldShowMenu = user && (user.role === 'admin' || user.role === 'asesor');

    const handleChangeProfilePicture = () => {
        if (onShowChangeProfilePicture) {
            onShowChangeProfilePicture();
        }
        closeAllPopups();
    };
    const handleChangeUsername = () => {
        closeAllPopups();
        setIsChangeUsernameOpen(true);
    };
    const handleCloseChangeUsername = () => {
        setIsChangeUsernameOpen(false);
    };
    const handleChangePassword = () => {
        closeAllPopups();
        setIsChangePasswordOpen(true);
    };
    const handleCloseChangePassword = () => {
        setIsChangePasswordOpen(false);
    };
    const handleAddContactInfo = () => {
        closeAllPopups();
        setIsAdvisorContactFormOpen(true);
    };
    const handleCloseAdvisorContactForm = () => {
        setIsAdvisorContactFormOpen(false);
    };
    
    const handleLogout = () => {
        closeAllPopups();
        setLogoutPopupOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
        closeAllPopups();
        navigate('/login');
    };

    const handleCancelLogout = () => {
        setLogoutPopupOpen(false);
    };

    return (
        <header className="header-glassmorphism">
        <div className="header-logo">
            <img src={logoSmall} alt="MHARA logo" className="logo-small" />
        </div>
        <nav className="navbar">
            <ul className="nav-links">
            <li><Link to="/home" onClick={handleHomeClick}>Home</Link></li>
            <li><Link to="/catalogo">Catalogo</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><a href="#" onClick={handleContactClick}>Contactanos</a></li>
            </ul>
        </nav>
        <div className="header-icons">
                        {user && user.agentCode && (
                <div className="agent-code-display">
                    <span className="agent-code-text">{user.agentCode}</span>
                </div>
            )}
            <span onClick={toggleFavorites} style={{ cursor: 'pointer' }}>
                <img src={iconShoping} alt="Icon Shoping" className='iconShoping'/>
            </span>
            <span onClick={toggleProfileMenu} style={{ cursor: 'pointer' }}>
                <img src={user?.profileImageUrl || iconUser} alt="Icon User" className='iconUser'/>
            </span>
            {isProfileMenuOpen && (
                <ProfileDropdownMenu
                    onChangeProfilePicture={handleChangeProfilePicture}
                    onChangeUsername={handleChangeUsername}
                    onChangePassword={handleChangePassword}
                    onAddContactInfo={handleAddContactInfo}
                    onLogout={handleLogout}
                />
            )}
            
            {shouldShowMenu && (
                <>
                    <span onClick={toggleMenu} style={{ cursor: 'pointer' }}>☰</span>
                    {isMenuOpen && <DropdownMenu 
                        onUploadPropertyClick={onUploadPropertyClick} 
                        onEditPropertyClick={onEditPropertyClick} 
                    />}
                </>
            )}
        </div>
        {isFavoritesOpen && (
            <FavoritesPopup
                isOpen={isFavoritesOpen}
                onClose={toggleFavorites}
                favorites={favoriteProperties}
                onSelectProperty={handleSelectFavorite}
            />
        )}
        {isChangeUsernameOpen && (
            <ChangeUsername onClose={handleCloseChangeUsername} />
        )}
        {isChangePasswordOpen && (
            <ChangePassword onClose={handleCloseChangePassword} />
        )}
        {isAdvisorContactFormOpen && (
            <AdvisorContactForm
                onClose={handleCloseAdvisorContactForm}
            />
        )}
        {isLogoutPopupOpen && (
            <LogoutConfirmationPopup
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        )}
        </header>
    );
};

export default Header;