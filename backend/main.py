# Archivo: backend/main.py
from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from database import get_database, close_mongo_connection, client, create_user, get_user, get_properties
from auth import hash_password, verify_password
from pymongo.errors import ConnectionFailure

app = FastAPI()

# --- Configuración de CORS ---
origins = [
    "http://localhost:5173",  # El origen de tu frontend
    # Puedes añadir más orígenes si es necesario
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_router = APIRouter()
properties_router = APIRouter()

# --- Modelos Pydantic ---
class UserRegistration(BaseModel):
    fullName: str
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- Eventos de la aplicación ---
@app.on_event("startup")
async def startup_db_client():
    if client is None:
        raise ConnectionFailure("No se pudo conectar a MongoDB al iniciar la aplicación.")
    app.mongodb = get_database()
    print("Conectado a la base de datos MongoDB y lista para usar.")

@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()
    print("La conexión a MongoDB ha sido cerrada.")

# --- Endpoints de Autenticación ---
@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegistration):
    """
    Endpoint para registrar un nuevo usuario.
    """
    # Verificar si el usuario ya existe
    if get_user(user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está registrado."
        )

    # Hashear la contraseña antes de guardarla
    hashed_pass = hash_password(user.password)
    
    # Crear el diccionario de datos del usuario para la base de datos
    user_data = user.dict()
    user_data["password"] = hashed_pass
    
    # Intentar crear el usuario en la base de datos
    new_user = create_user(user_data)
    
    if new_user is None:
        # Esto podría ocurrir si hay una condición de carrera, 
        # donde el usuario se crea después de nuestra verificación inicial.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El usuario no pudo ser creado, por favor intente de nuevo."
        )
    
    return {"message": "Usuario creado exitosamente.", "user_id": str(new_user.inserted_id)}

@auth_router.post("/login")
def login_user(user_credentials: UserLogin):
    """
    Endpoint para iniciar sesión.
    """
    db_user = get_user(user_credentials.username)
    
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    if not verify_password(user_credentials.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta."
        )
    
    # En una aplicación real, aquí se generaría y devolvería un token (por ejemplo, JWT)
    return {"message": "Inicio de sesión exitoso."}

# --- Endpoints Principales ---
@app.get("/")
def read_root():
    return {"Hello": "World Perraso"}

@app.get("/api/v1/test-db")
def test_db_connection():
    """
    Endpoint de prueba para verificar la conexión a la base de datos.
    """
    if client:
        try:
            client.admin.command('ping')
            return {"status": "success", "message": "La conexión con MongoDB está activa."}
        except Exception as e:
            return {"status": "error", "message": f"No se pudo conectar a MongoDB: {e}"}
    else:
        return {"status": "error", "message": "El cliente de MongoDB no está inicializado."}

# --- Endpoints de Propiedades ---
@properties_router.get("/")
def list_properties():
    """
    Endpoint para obtener todas las propiedades.
    """
    properties = get_properties()
    if properties is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudieron recuperar las propiedades de la base de datos."
        )
    return properties

# Incluir el router de autenticación en la aplicación principal
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(properties_router, prefix="/api/v1/properties", tags=["properties"])