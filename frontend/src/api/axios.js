import axios from 'axios';

// Determinar la URL base dependiendo del entorno.
// import.meta.env.PROD es una variable especial de Vite que es `true` en el build de producción.
// VITE_API_URL será nuestra variable de entorno para la URL del backend en producción.
const baseURL = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : '/api'; // Para el proxy de desarrollo de Vite, solo necesitamos el prefijo.

const apiClient = axios.create({
    baseURL: baseURL,
});

export default apiClient;
