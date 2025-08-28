import os
import uuid
import random
import string
from fastapi import FastAPI, APIRouter, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
from database import (
    connect_to_mongo,
    close_mongo_connection,
    get_user,
    get_user_by_email,
    create_user,
    get_properties,
    get_advisors,
    create_property,
    update_user_to_advisor,
    add_favorite,
    remove_favorite,
    get_user_favorites,
    get_property_by_id,
    update_property,
    delete_property_by_id,
    get_user_by_id,
    update_username,
    update_password,
    update_user_contact_info,
    update_user_profile_image,
    search_users_by_username,
    get_user_by_agent_code,
    update_user_role,
    get_advisor_by_code,
)
from auth import hash_password, verify_password
from s3_utils import upload_file_to_s3, delete_file_from_s3, S3_BUCKET_NAME, AWS_REGION
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

class UsernameUpdate(BaseModel):
    newUsername: str
    password: str

class PasswordUpdate(BaseModel):
    currentPassword: str
    newPassword: str

class ContactInfoUpdate(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    instagram: Optional[str] = None
    tiktok: Optional[str] = None

class RoleUpdate(BaseModel):
    role: str

# --- Endpoints de Autenticación ---

def generate_agent_code(length=5):
    """Genera un código alfanumérico aleatorio para los agentes."""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for i in range(length))

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegistration):
    if get_user(user.username):
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado.")
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="El correo electrónico ya está en uso.")
    
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
    user_data["agentCode"] = generate_agent_code()
    
    new_user = create_user(user_data)
    if new_user is None:
        raise HTTPException(status_code=409, detail="El usuario no pudo ser creado.")
    
    return {"message": "Usuario creado exitosamente.", "user_id": str(new_user.inserted_id)}

@auth_router.post("/login")
def login_user(user_credentials: UserLogin):
    db_user = get_user(user_credentials.username)
    if not db_user or not verify_password(user_credentials.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")
    
    db_user['_id'] = str(db_user['_id'])
    return {
        "message": "Inicio de sesión exitoso.",
        "user": {
            "_id": db_user.get("_id"),
            "fullName": db_user.get("fullName"),
            "username": db_user.get("username"),
            "role": db_user.get("role", "user"),
            "profileImageUrl": db_user.get("profileImageUrl"),
            "agentCode": db_user.get("agentCode")
        }
    }

# --- Endpoints de Propiedades ---
def generate_property_code(length=4):
    """Genera un código alfanumérico aleatorio para las propiedades."""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for i in range(length))

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
    shortAddress: str = Form(...),
    customOptions: List[str] = Form(...)
):
    photo_urls = []
    for photo in photos:
        file_extension = os.path.splitext(photo.filename)[1]
        unique_filename = f"properties/{uuid.uuid4()}{file_extension}"
        
        file_url = upload_file_to_s3(
            file=photo.file, 
            object_name=unique_filename, 
            content_type=photo.content_type
        )
        
        if not file_url:
            raise HTTPException(status_code=500, detail="Error al subir una de las imágenes a S3.")
        
        photo_urls.append(file_url)

    property_data = {
        "code": generate_property_code(),
        "photos": photo_urls,
        "price": price,
        "negotiationType": negotiationType,
        "agentCode": agentCode,
        "location": {"lat": lat, "lng": lng},
        "detailedAddress": detailedAddress,
        "shortAddress": shortAddress,
        "customOptions": [opt for opt in customOptions if opt]
    }

    new_property = create_property(property_data)
    if new_property is None:
        raise HTTPException(status_code=500, detail="La propiedad no pudo ser creada en la base de datos.")
        
    return {"message": "Propiedad creada exitosamente.", "property_id": str(new_property.inserted_id)}

@properties_router.put("/{property_id}", status_code=status.HTTP_200_OK)
async def update_property_endpoint(
    property_id: str,
    price: Optional[float] = Form(None),
    negotiationType: Optional[str] = Form(None),
    agentCode: Optional[str] = Form(None),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    detailedAddress: Optional[str] = Form(None),
    customOptions: Optional[List[str]] = Form(None),
    new_photos: List[UploadFile] = File([]),
    deleted_photos: Optional[List[str]] = Form(None)
):
    existing_property = get_property_by_id(property_id)
    if not existing_property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada.")

    update_data = {}
    if price is not None: update_data["price"] = price
    if negotiationType is not None: update_data["negotiationType"] = negotiationType
    if agentCode is not None: update_data["agentCode"] = agentCode
    if detailedAddress is not None: update_data["detailedAddress"] = detailedAddress
    if customOptions is not None: update_data["customOptions"] = [opt for opt in customOptions if opt]
    if lat is not None and lng is not None: update_data["location"] = {"lat": lat, "lng": lng}

    current_photos = existing_property.get("photos", [])
    if deleted_photos:
        for photo_url in deleted_photos:
            if S3_BUCKET_NAME in photo_url:
                object_name = photo_url.split(f"{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/")[1]
                delete_file_from_s3(object_name)
        current_photos = [p for p in current_photos if p not in deleted_photos]

    new_photo_urls = []
    for photo in new_photos:
        file_extension = os.path.splitext(photo.filename)[1]
        unique_filename = f"properties/{uuid.uuid4()}{file_extension}"
        file_url = upload_file_to_s3(photo.file, unique_filename, photo.content_type)
        if not file_url:
            raise HTTPException(status_code=500, detail="Error al subir nueva imagen a S3.")
        new_photo_urls.append(file_url)

    update_data["photos"] = current_photos + new_photo_urls

    if update_data:
        success = update_property(property_id, update_data)
        if not success:
            raise HTTPException(status_code=500, detail="No se pudo actualizar la propiedad.")

    return {"message": "Propiedad actualizada exitosamente."}

@properties_router.delete("/{property_id}", status_code=status.HTTP_200_OK)
def delete_property_endpoint(property_id: str):
    prop_to_delete = get_property_by_id(property_id)
    if not prop_to_delete:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada.")

    photos_to_delete = prop_to_delete.get("photos", [])
    for photo_url in photos_to_delete:
        if S3_BUCKET_NAME in photo_url:
            object_name = photo_url.split(f"{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/")[1]
            delete_file_from_s3(object_name)

    success = delete_property_by_id(property_id)
    if not success:
        raise HTTPException(status_code=500, detail="No se pudo eliminar la propiedad de la base de datos.")

    return {"message": "Propiedad eliminada exitosamente."}

# --- Endpoints de Usuarios ---
@users_router.post("/{user_id}/profile-picture", status_code=status.HTTP_200_OK)
async def upload_profile_picture(user_id: str, profileImage: UploadFile = File(...)):
    file_extension = os.path.splitext(profileImage.filename)[1]
    unique_filename = f"profiles/{uuid.uuid4()}{file_extension}"
    file_url = upload_file_to_s3(
        file=profileImage.file,
        object_name=unique_filename,
        content_type=profileImage.content_type
    )
    if not file_url:
        raise HTTPException(status_code=500, detail="Error al subir la imagen de perfil a S3.")
    
    success = update_user_profile_image(user_id, file_url)
    if not success:
        raise HTTPException(status_code=404, detail="No se pudo encontrar o actualizar el usuario.")
    
    updated_user = get_user_by_id(user_id)
    if updated_user:
        updated_user['_id'] = str(updated_user['_id'])
        return {"message": "Foto de perfil actualizada.", "user": updated_user}
    raise HTTPException(status_code=404, detail="Usuario no encontrado después de la actualización.")

@users_router.get("/advisors")
def list_advisors():
    return get_advisors()

@users_router.put("/{user_id}/username", status_code=status.HTTP_200_OK)
def change_username(user_id: str, payload: UsernameUpdate):
    user = get_user_by_id(user_id)
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta.")
    
    if get_user(payload.newUsername):
        raise HTTPException(status_code=400, detail="El nuevo nombre de usuario ya está en uso.")

    success = update_username(user_id, payload.newUsername)
    if not success:
        raise HTTPException(status_code=500, detail="No se pudo actualizar el nombre de usuario.")
    
    updated_user = get_user_by_id(user_id)
    updated_user['_id'] = str(updated_user['_id'])
    return {"message": "Nombre de usuario actualizado con éxito!", "user": updated_user}

@users_router.put("/{user_id}/password", status_code=status.HTTP_200_OK)
def change_password(user_id: str, payload: PasswordUpdate):
    user = get_user_by_id(user_id)
    if not user or not verify_password(payload.currentPassword, user["password"]):
        raise HTTPException(status_code=401, detail="La contraseña actual es incorrecta.")

    new_hashed_password = hash_password(payload.newPassword)
    success = update_password(user_id, new_hashed_password)

    if not success:
        raise HTTPException(status_code=500, detail="No se pudo actualizar la contraseña.")

    return {"message": "Contraseña actualizada exitosamente."}

@users_router.put("/{user_id}/contact-info", status_code=status.HTTP_200_OK)
def update_contact_info(user_id: str, payload: ContactInfoUpdate):
    contact_data = payload.dict(exclude_unset=True)
    if not contact_data:
        raise HTTPException(status_code=400, detail="No se proporcionó información para actualizar.")

    success = update_user_contact_info(user_id, contact_data)
    if not success:
        raise HTTPException(status_code=500, detail="No se pudo actualizar la información de contacto.")

    updated_user = get_user_by_id(user_id)
    if updated_user:
        updated_user['_id'] = str(updated_user['_id'])
        return {"message": "Información de contacto actualizada.", "user": updated_user}
    
    raise HTTPException(status_code=404, detail="Usuario no encontrado después de la actualización.")

@users_router.get("/search/{query}")
def search_for_users(query: str):
    # Se podría añadir una validación para la longitud de la consulta
    if len(query) < 2:
        return [] # Opcional: devolver lista vacía para búsquedas muy cortas
    users = search_users_by_username(query)
    return users

@users_router.get("/by-code/{agent_code}")
def get_user_by_code(agent_code: str):
    user = get_user_by_agent_code(agent_code)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado con ese código.")
    
    user['_id'] = str(user['_id'])
    if 'password' in user:
        del user['password']
    return user

@users_router.put("/{user_id}/role", status_code=status.HTTP_200_OK)
def set_user_role(user_id: str, payload: RoleUpdate):
    success = update_user_role(user_id, payload.role)
    if not success:
        raise HTTPException(status_code=500, detail="No se pudo actualizar el rol del usuario.")
    
    updated_user = get_user_by_id(user_id)
    if updated_user:
        updated_user['_id'] = str(updated_user['_id'])
        if 'password' in updated_user:
            del updated_user['password']
        return {"message": "Rol de usuario actualizado.", "user": updated_user}
    
    raise HTTPException(status_code=404, detail="Usuario no encontrado después de la actualización.")

@users_router.get("/advisor/{agent_code}")
def get_advisor_details(agent_code: str):
    advisor = get_advisor_by_code(agent_code)
    if not advisor:
        raise HTTPException(status_code=404, detail="Asesor no encontrado.")
    return advisor

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

    success = update_user_to_advisor(advisor_data.username)

    if not success:
        raise HTTPException(status_code=500, detail="No se pudo actualizar el rol del usuario.")

    return {"message": f"El usuario {advisor_data.username} ahora es un asesor."}

@users_router.post("/{username}/favorites/{property_id}", status_code=status.HTTP_200_OK)
def add_property_to_favorites(username: str, property_id: str):
    # En un caso real, validar que el usuario que hace la petición es el mismo que {username}
    success = add_favorite(username, property_id)
    if not success:
        # Podría ser que el usuario no exista o la propiedad ya esté en favoritos.
        # Devolvemos 200 OK para simplificar, ya que el estado final es el deseado.
        pass
    return {"message": "Propiedad añadida a favoritos."}

@users_router.delete("/{username}/favorites/{property_id}", status_code=status.HTTP_200_OK)
def remove_property_from_favorites(username: str, property_id: str):
    success = remove_favorite(username, property_id)
    if not success:
        # Idem, si no se modificó, puede que ya no estuviera.
        pass
    return {"message": "Propiedad eliminada de favoritos."}

@users_router.get("/{username}/favorites", status_code=status.HTTP_200_OK)
def get_favorites_list(username: str):
    favorites = get_user_favorites(username)
    return {"favorites": favorites}


# Incluir routers en la aplicación principal
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(properties_router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])