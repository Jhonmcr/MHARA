import os
import uuid
from fastapi import FastAPI, APIRouter, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from typing import List, Dict, Any
from database import (
    connect_to_mongo,
    close_mongo_connection,
    get_user,
    create_user,
    get_properties,
    get_advisors,
    create_property,
    update_user_to_advisor,
)
from auth import hash_password, verify_password
from s3_utils import upload_file_to_s3
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

class AdvisorUpdate(BaseModel):
    username: str
    advisor_code: str

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

@properties_router.post("/", status_code=status.HTTP_201_CREATED)
async def add_property(
    photos: List[UploadFile] = File(...),
    price: float = Form(...),
    negotiationType: str = Form(...),
    agentCode: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    detailedAddress: str = Form(...),
    customOptions: List[str] = Form(...)
):
    photo_urls = []
    for photo in photos:
        # Generar un nombre de archivo único para evitar colisiones en S3
        file_extension = os.path.splitext(photo.filename)[1]
        unique_filename = f"properties/{uuid.uuid4()}{file_extension}"
        
        # Subir el archivo a S3
        file_url = upload_file_to_s3(photo.file, unique_filename)
        
        if not file_url:
            raise HTTPException(status_code=500, detail="Error al subir una de las imágenes a S3.")
        
        photo_urls.append(file_url)

    # Crear el diccionario de la propiedad para guardarlo en la base de datos
    property_data = {
        "photos": photo_urls,
        "price": price,
        "negotiationType": negotiationType,
        "agentCode": agentCode,
        "location": {"lat": lat, "lng": lng},
        "detailedAddress": detailedAddress,
        "customOptions": customOptions
    }

    new_property = create_property(property_data)
    if new_property is None:
        raise HTTPException(status_code=500, detail="La propiedad no pudo ser creada en la base de datos.")
        
    return {"message": "Propiedad creada exitosamente.", "property_id": str(new_property.inserted_id)}

# --- Endpoints de Usuarios ---
@users_router.get("/advisors")
def list_advisors():
    return get_advisors()

@users_router.post("/make-advisor", status_code=status.HTTP_200_OK)
def make_user_advisor(advisor_data: AdvisorUpdate):
    # In a real-world scenario, this endpoint should be protected
    # and only accessible by an admin.
    
    db_user = get_user(advisor_data.username)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    # Optional: Check if the user is already an advisor
    if db_user.get("role") == "asesor":
        # You can decide to return a specific message or just confirm the state
        return {"message": "El usuario ya es un asesor."}

    success = update_user_to_advisor(advisor_data.username, advisor_data.advisor_code)

    if not success:
        raise HTTPException(status_code=500, detail="No se pudo actualizar el rol del usuario.")

    return {"message": f"El usuario {advisor_data.username} ahora es un asesor."}


# Incluir routers en la aplicación principal
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(properties_router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])