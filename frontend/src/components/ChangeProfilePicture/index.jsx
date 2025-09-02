import React, { useState, useRef } from 'react';
import apiClient from '../../api/axios';
import './ChangeProfilePicture.css';
import userIcon from '../../assets/icons/usuario.png';

const ChangeProfilePicture = ({ user, setUser }) => {
    console.log("User in ChangeProfilePicture:", user);
    const [preview, setPreview] = useState(user?.profileImageUrl || userIcon);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file || !user || !user._id) {
            alert("No se ha podido identificar al usuario. Por favor, inicie sesión de nuevo.");
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await apiClient.post(`/users/${user._id}/profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUser(response.data); // Update user in context
            alert('Foto de perfil actualizada con éxito!');

        } catch (error) {
            console.error('Error uploading profile picture:', error);
            const errorMessage = error.response?.data?.detail || 'Error al subir la imagen';
            alert(errorMessage);
        }
    };

    return (
        <div className="change-profile-picture-container">
            <h2>Cambiar Foto de Perfil</h2>
            <div className="image-preview-container" onClick={() => fileInputRef.current.click()}>
                <img src={preview} alt="Vista previa" className="image-preview" />
                <div className="overlay">Haz clic para cambiar</div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
            />
            <button onClick={handleUpload} className="upload-button" disabled={!file}>
                Guardar Foto
            </button>
        </div>
    );
};

export default ChangeProfilePicture;
