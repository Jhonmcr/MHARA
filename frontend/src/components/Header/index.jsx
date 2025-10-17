import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import toast, { Toaster } from 'react-hot-toast';
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

const AuthProtectedLink = ({ children, onClick, isAuthenticated }) => {
    const handleInteraction = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error("Debes iniciar sesión para realizar esta acción.");
        } else if (onClick) {
            onClick(e);
        }
    };

    const childProps = {
        onClick: handleInteraction,
        className: `${children.props.className || ''} ${!isAuthenticated ? 'disabled' : ''}`.trim()
    };

    return React.cloneElement(children, childProps);
};

const Header = ({ onUploadPropertyClick, onEditPropertyClick, onContactClick, onHomeClick, onShowChangeProfilePicture }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isAdvisorContactFormOpen, setIsAdvisorContactFormOpen] = useState(false);
    const [isLogoutPopupOpen, setLogoutPopupOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
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
        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para acceder al menú.");
            return;
        }
        const wasOpen = isMenuOpen;
        closeAllPopups();
        setIsMenuOpen(!wasOpen);
    };

    const toggleProfileMenu = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const wasOpen = isProfileMenuOpen;
        closeAllPopups();
        setIsProfileMenuOpen(!wasOpen);
    };

    const toggleFavorites = () => {
        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para ver tus favoritos.");
            return;
        }
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
            <Toaster position="top-center" reverseOrder={false} />
            <div className="header-logo">
                <img src={logoSmall} alt="MHARA logo" className="logo-small" />
            </div>
            <nav className="navbar">
                <ul className="nav-links">
                    <li><AuthProtectedLink isAuthenticated={isAuthenticated}><Link to="/home" onClick={handleHomeClick}>Home</Link></AuthProtectedLink></li>
                    <li><Link to="/catalogo">Catalogo</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                    <li><AuthProtectedLink isAuthenticated={isAuthenticated}><a href="#" onClick={handleContactClick}>Contactanos</a></AuthProtectedLink></li>
                </ul>
            </nav>
            <div className="header-icons">
                {user && user.agentCode && (
                    <div className="agent-code-display">
                        <span className="agent-code-text">{user.agentCode}</span>
                    </div>
                )}
                <span onClick={toggleFavorites} style={{ cursor: 'pointer' }} className={!isAuthenticated ? 'disabled' : ''}>
                    <img src={iconShoping} alt="Icon Shoping" className='iconShoping'/>
                </span>
                <span onClick={toggleProfileMenu} style={{ cursor: 'pointer' }} className={!isAuthenticated ? 'disabled' : ''}>
                    <img src={iconUser} alt="Icon User" className='iconUser'/>
                </span>
                {isProfileMenuOpen && isAuthenticated && (
                    <ProfileDropdownMenu
                        onChangeProfilePicture={handleChangeProfilePicture}
                        onChangeUsername={handleChangeUsername}
                        onChangePassword={handleChangePassword}
                        onAddContactInfo={handleAddContactInfo}
                        onLogout={handleLogout}
                    />
                )}
                
                {shouldShowMenu && isAuthenticated && (
                    <>
                        <span onClick={toggleMenu} style={{ cursor: 'pointer' }} className={!isAuthenticated ? 'disabled' : ''}>☰</span>
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