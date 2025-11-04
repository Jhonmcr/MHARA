import React, { useState, useEffect } from 'react';
import './FullscreenGallery.css';

const FullscreenGallery = ({ images, startIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        } else if (e.key === 'ArrowLeft') {
            goToPrevious();
        }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="fullscreen-gallery-backdrop" onClick={handleBackdropClick}>
            <button className="gallery-close-btn" onClick={onClose}>
                &times;
            </button>

            <div className="gallery-content">
                <button className="gallery-nav-btn prev" onClick={goToPrevious}>
                &#10094;
                </button>
                <img
                src={images[currentIndex]}
                alt={`View ${currentIndex + 1} of ${images.length}`}
                className="gallery-image"
                />
                <button className="gallery-nav-btn next" onClick={goToNext}>
                &#10095;
                </button>
            </div>

            <div className="gallery-indicator">
                <p>{currentIndex + 1} / {images.length}</p>
            </div>
        </div>
    );
};

export default FullscreenGallery;