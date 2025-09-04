import axios from 'axios';

// Determinar la URL base dependiendo del entorno.
const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL // -> https://inmo-backend.onrender.com/api/v1
  : '/api/v1'; // Para el proxy de desarrollo, usamos la base estandarizada.

const apiClient = axios.create({
  baseURL: baseURL,
});

export default apiClient;
