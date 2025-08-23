import os
from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from database import (
    connect_to_mongo, 
    close_mongo_connection, 
    get_user, 
    create_user, 
    get_properties, 
    get_advisors
)
from auth import hash_password, verify_password
from pymongo.errors import ConnectionFailure

# Cargar variables de entorno
load_dotenv()

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
if not ADMIN_TOKEN:
    # This will stop the app from starting if the token is not configured.
    raise EnvironmentError("La variable de entorno ADMIN_TOKEN no está configurada.")

app = FastAPI()

# --- Configuración de CORS ---
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Eventos de la aplicación ---
@app.on_event("startup")
async def startup_db_client():
    connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()

# --- Routers ---
auth_router = APIRouter()
properties_router = APIRouter()
users_router = APIRouter()

# --- Modelos Pydantic ---
class UserRegistration(BaseModel):
    fullName: str
    email: EmailStr
    username: str
    password: str
    token: str | None = None

class UserLogin(BaseModel):
    username: str
    password: str

# --- Endpoints de Autenticación ---
@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegistration):
    if get_user(user.username):
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado.")
    
    role = "user"
    if user.token:
        if user.token == ADMIN_TOKEN:
            role = "admin"
        else:
            raise HTTPException(status_code=400, detail="Token incorrecto.")

    hashed_pass = hash_password(user.password)
    user_data = user.dict(exclude={"token"})
    user_data["password"] = hashed_pass
    user_data["role"] = role
    
    new_user = create_user(user_data)
    if new_user is None:
        raise HTTPException(status_code=409, detail="El usuario no pudo ser creado.")
    
    return {"message": "Usuario creado exitosamente.", "user_id": str(new_user.inserted_id)}

@auth_router.post("/login")
def login_user(user_credentials: UserLogin):
    db_user = get_user(user_credentials.username)
    if not db_user or not verify_password(user_credentials.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")
    
    return {
        "message": "Inicio de sesión exitoso.",
        "user": {
            "fullName": db_user.get("fullName"),
            "username": db_user.get("username"),
            "role": db_user.get("role", "user")
        }
    }

# --- Endpoints de Propiedades ---
@properties_router.get("/")
def list_properties():
    return get_properties()

# --- Endpoints de Usuarios ---
@users_router.get("/advisors")
def list_advisors():
    return get_advisors()


# Incluir routers en la aplicación principal
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(properties_router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])