import axios from 'axios';

// Se crea una instancia de Axios con una configuración base.
// La URL base para todas las peticiones se toma de las variables de entorno de Vite.
// Esto es crucial para que la aplicación pueda apuntar a diferentes URLs
// en desarrollo (localhost) y en producción (Render).
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
