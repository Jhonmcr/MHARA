import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './UploadPropertyPopup.css';

// Componente para el popup de añadir opción
const AddOptionPopup = ({ onAdd, onClose, existingOptions }) => {
    const [option, setOption] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!option.includes(':')) {
            setError('El formato debe ser "Clave: Valor" (ej. "Habitaciones: 5").');
            return;
        }
        if (existingOptions.includes(option)) {
            setError('Esta opción ya existe.');
            return;
        }
        onAdd(option);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content add-option-popup">
                <h2>Añadir Nueva Característica</h2>
                <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                        setOption(e.target.value);
                        setError('');
                    }}
                    placeholder="Ej: Habitaciones: 5"
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="popup-actions">
                    <button onClick={handleAdd} className="add-btn-new">Agregar</button>
                    <button onClick={onClose} className="close-btn-new">Cerrar</button>
                </div>
            </div>
        </div>
    );
};


const UploadPropertyPopup = ({ onClose, onPublish, propertyToEdit }) => {
    const isEditMode = Boolean(propertyToEdit);
    const [propertyData, setPropertyData] = useState({
        photos: [], // Almacenará objetos { file, preview } o { url, preview }
        price: '',
        negotiationType: 'Venta',
        agentCode: '',
        location: { lat: 10.6, lng: -66.933 },
        detailedAddress: '',
        shortAddress: '',
        customOptions: [],
    });
    const [negotiationTypes, setNegotiationTypes] = useState(['Venta', 'Alquiler', 'Vacacional']);
    const [newNegotiationType, setNewNegotiationType] = useState('');
    const [isAddOptionPopupOpen, setAddOptionPopupOpen] = useState(false);
    const [deletedPhotos, setDeletedPhotos] = useState([]); // URLs of photos to delete
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isEditMode) {
            setPropertyData({
                photos: propertyToEdit.photos.map(url => ({ url, preview: url })),
                price: propertyToEdit.price || '',
                negotiationType: propertyToEdit.negotiationType || 'Venta',
                agentCode: propertyToEdit.agentCode || '',
                location: propertyToEdit.location || { lat: 10.6, lng: -66.933 },
                detailedAddress: propertyToEdit.detailedAddress || '',
                shortAddress: propertyToEdit.shortAddress || '',
                customOptions: propertyToEdit.customOptions || [],
            });
            // Poblar también los tipos de negociación por si hay uno personalizado
            if (propertyToEdit.negotiationType && !negotiationTypes.includes(propertyToEdit.negotiationType)) {
                setNegotiationTypes(prev => [...prev, propertyToEdit.negotiationType]);
            }
        }
    }, [propertyToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setPropertyData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    };

    const handleRemovePhoto = (index) => {
        const photoToRemove = propertyData.photos[index];

        // If the photo has a URL, it's an existing photo. Mark it for deletion.
        if (photoToRemove.url) {
            setDeletedPhotos(prev => [...prev, photoToRemove.url]);
        } else {
            // If it's a new photo (File object), revoke its preview URL
            URL.revokeObjectURL(photoToRemove.preview);
        }

        // Remove the photo from the display array
        setPropertyData(prev => {
            const newPhotos = [...prev.photos];
            newPhotos.splice(index, 1);
            return { ...prev, photos: newPhotos };
        });
    };
    
    const handleLocationChange = (latlng) => {
        setPropertyData(prev => ({ ...prev, location: latlng }));
    };

    const handleAddCustomOption = (option) => {
        setPropertyData(prev => ({ ...prev, customOptions: [...prev.customOptions, option] }));
    };

    const handleRemoveCustomOption = (index) => {
        setPropertyData(prev => {
            const newOptions = [...prev.customOptions];
            newOptions.splice(index, 1);
            return { ...prev, customOptions: newOptions };
        });
    };
    
    const handleAddNewNegotiationType = () => {
        if (newNegotiationType && !negotiationTypes.includes(newNegotiationType)) {
            setNegotiationTypes([...negotiationTypes, newNegotiationType]);
            setNewNegotiationType('');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Está seguro de que desea eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/properties/${propertyToEdit.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al eliminar la propiedad');
            }

            alert('Propiedad eliminada con éxito.');
            onPublish({ action: 'delete' }); // Re-use onPublish to trigger refetch
            onClose();

        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleSubmit = async () => {
        // Validación
        if (!propertyData.price || !propertyData.agentCode || !propertyData.detailedAddress || propertyData.photos.length === 0) {
            alert('Por favor, complete todos los campos obligatorios y suba al menos una foto.');
            return;
        }

        const formData = new FormData();
        
        // Adjuntar solo los datos que han cambiado o son necesarios
        formData.append('price', parseFloat(propertyData.price));
        formData.append('negotiationType', propertyData.negotiationType);
        formData.append('agentCode', propertyData.agentCode);
        formData.append('lat', propertyData.location.lat);
        formData.append('lng', propertyData.location.lng);
        formData.append('detailedAddress', propertyData.detailedAddress);
        formData.append('shortAddress', propertyData.shortAddress);
        
        propertyData.customOptions.forEach(option => {
            formData.append('customOptions', option);
        });

        const url = isEditMode 
            ? `http://localhost:8000/api/v1/properties/${propertyToEdit.id}`
            : 'http://localhost:8000/api/v1/properties/';
        
        const method = isEditMode ? 'PUT' : 'POST';

        // Adjuntar fotos nuevas y marcadas para eliminar
        if (isEditMode) {
            deletedPhotos.forEach(url => {
                formData.append('deleted_photos', url);
            });
            propertyData.photos.forEach(photo => {
                if (photo.file) { // Solo subir las nuevas fotos
                    formData.append('new_photos', photo.file);
                }
            });
        } else {
            propertyData.photos.forEach(photo => {
                formData.append('photos', photo.file);
            });
        }

        try {
            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Error al ${isEditMode ? 'actualizar' : 'publicar'} la propiedad`);
            }

            const result = await response.json();
            alert(`Propiedad ${isEditMode ? 'actualizada' : 'publicada'} con éxito!`);
            onPublish(result);
            onClose();

        } catch (error) {
            console.error(`Error al ${isEditMode ? 'actualizar' : 'publicar'} la propiedad:`, error);
            alert(`Error: ${error.message}`);
        }
    };

    // Componente interno para manejar eventos del mapa
    function LocationMarker() {
        useMapEvents({
            click(e) {
                handleLocationChange(e.latlng);
            },
        });
        return propertyData.location ? <Marker position={propertyData.location}></Marker> : null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{isEditMode ? 'Editar Propiedad' : 'Subir Nueva Propiedad'}</h2>

                {/* --- Sección de Fotos --- */}
                <div className="form-section photo-upload-section">
                    <h3>Fotos de la Propiedad</h3>
                    <input
                        type="file"
                        multiple
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <button onClick={() => fileInputRef.current.click()} className="add-btn">
                        Seleccionar Fotos
                    </button>
                    <div className="photo-previews">
                        {propertyData.photos.map((photo, index) => (
                            <div key={index} className="photo-preview-item">
                                <img src={photo.preview} alt={`preview ${index}`} />
                                <button onClick={() => handleRemovePhoto(index)} className="remove-photo-btn">X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='form-grid-father'>
                    {/* --- Sección de Detalles --- */}
                    <div className="form-grid">
                        <label>
                            Precio (€):
                            <input type="number" name="price" value={propertyData.price} onChange={handleChange} required />
                        </label>
                        <label>
                            Código del Asesor:
                            <input type="text" name="agentCode" value={propertyData.agentCode} onChange={handleChange} required />
                        </label>

                        <label>
                            Tipo de Negociación:
                            <select name="negotiationType" value={propertyData.negotiationType} onChange={handleChange}>
                                {negotiationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            <div>
                            <input 
                                type="text" 
                                value={newNegotiationType} 
                                onChange={(e) => setNewNegotiationType(e.target.value)}
                                placeholder="Añadir otro tipo"
                            />
                            <button onClick={handleAddNewNegotiationType} className="add-btn" style={{marginLeft: '10px'}}>+</button>
                        </div>
                        </label>

                        {/* --- Sección de Opciones Personalizadas --- */}
                        <div className="form-section custom-options-section">
                            <h3>Características Adicionales</h3>
                            <button onClick={() => setAddOptionPopupOpen(true)} className="add-btn">
                                Agregar Característica
                            </button>
                            <div className="custom-options-list">
                                {propertyData.customOptions.map((option, index) => (
                                    <span key={index} className="custom-option-tag">
                                        {option}
                                        <button onClick={() => handleRemoveCustomOption(index)} className="remove-option-btn">x</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Sección de Ubicación --- */}
                    <div className="form-section location-section">
                        <h3>Ubicación en el Mapa</h3>
                        <div className="map-container">
                            <MapContainer center={[propertyData.location.lat, propertyData.location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                        <label>
                            Dirección Corta (Ciudad, Estado):
                            <input type="text" name="shortAddress" value={propertyData.shortAddress} onChange={handleChange} placeholder="Ej: La Guaira, Vargas" />
                        </label>
                        <label>
                            Dirección Detallada:
                            <input type="text" name="detailedAddress" value={propertyData.detailedAddress} onChange={handleChange} placeholder="Ej: Calle Falsa 123, Apto 4B, La Guaira" />
                        </label>
                    </div>
                </div>
                <div className="popup-actions">
                    <button onClick={handleSubmit} className="publish-btn">
                        {isEditMode ? 'Actualizar Propiedad' : 'Publicar Propiedad'}
                    </button>
                    {isEditMode && (
                        <button onClick={handleDelete} className="delete-btn">
                            Eliminar Propiedad
                        </button>
                    )}
                    <button onClick={onClose} className="close-btn">Cerrar</button>
                </div>
            </div>

            {isAddOptionPopupOpen && (
                <AddOptionPopup
                    onAdd={handleAddCustomOption}
                    onClose={() => setAddOptionPopupOpen(false)}
                    existingOptions={propertyData.customOptions}
                />
            )}
        </div>
    );
};

export default UploadPropertyPopup;
