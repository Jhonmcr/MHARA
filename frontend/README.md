# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Configuración del Entorno

Esta aplicación utiliza variables de entorno para conectarse con el servidor backend. Es crucial configurar estas variables correctamente para que la aplicación funcione tanto en desarrollo local como en producción.

### Variable de Entorno Requerida

- `VITE_API_URL`: La URL base completa del servidor backend.

### Desarrollo Local

Para ejecutar la aplicación en tu máquina local, necesitas crear un archivo `.env.development` en la raíz de la carpeta `frontend`. Este archivo no se sube a GitHub y solo se usa para desarrollo.

1.  **Crea el archivo**:
    ```bash
    touch frontend/.env.development
    ```

2.  **Añade el contenido**:
    ```
    # Apunta al backend que se ejecuta localmente en el puerto 8000
    VITE_API_URL=http://localhost:8000/api/v1
    ```

### Configuración para Producción (Render)

Para que la aplicación frontend se conecte al backend cuando esté desplegada en Render, debes configurar la variable de entorno en el dashboard de tu servicio de frontend.

1.  Ve a tu servicio de frontend en **Render.com**.
2.  Ve a la pestaña **"Environment"**.
3.  Añade una nueva variable de entorno:
    - **Key**: `VITE_API_URL`
    - **Value**: `https://inmo-backend.onrender.com/api/v1` (Usa la URL de tu servicio de backend en Render).

**Importante**: Después de añadir o cambiar una variable de entorno en Render, la plataforma iniciará un nuevo despliegue automáticamente para aplicar los cambios.
