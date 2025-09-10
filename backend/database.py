import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
from bson import ObjectId

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "MHARA") # Default to "MHARA"
client: MongoClient | None = None

def connect_to_mongo():
    """Establece la conexión con MongoDB."""
    global client
    if not MONGO_URI:
        raise EnvironmentError("La variable de entorno MONGO_URI no está configurada.")
    
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ismaster')
        print("Conexión a MongoDB exitosa.")
    except ConnectionFailure as e:
        print(f"Error en la conexión a MongoDB: {e}")
        client = None
        raise e

def close_mongo_connection():
    """Cierra la conexión a MongoDB."""
    global client
    if client:
        client.close()
        client = None
        print("Conexión a MongoDB cerrada.")

def get_database():
    """
    Retorna la instancia de la base de datos especificada en la variable de entorno DB_NAME.
    """
    if not DB_NAME:
        raise ValueError("La variable de entorno DB_NAME no está configurada. Este es un error fatal.")
    
    if client:
        return client.get_database(DB_NAME)
    
    return None

def get_user(username: str):
    """Busca un usuario por su nombre de usuario en la base de datos."""
    db = get_database()
    if db is not None:
        return db.users.find_one({"username": username})
    return None

def get_user_by_email(email: str):
    """Busca un usuario por su email en la base de datos."""
    db = get_database()
    if db is not None:
        return db.users.find_one({"email": email})
    return None

def get_user_by_agent_code(agent_code: str):
    """Busca un usuario por su código de agente en la base de datos."""
    db = get_database()
    if db is not None:
        return db.users.find_one({"agentCode": agent_code})
    return None

def create_user(user_data: dict):
    """
    Crea un nuevo usuario en la base de datos.
    Devuelve el resultado de la inserción si es exitoso, de lo contrario None.
    """
    db = get_database()
    if db is None:
        return None
    
    try:
        # La validación de existencia de usuario ya se hace en el endpoint,
        # por lo que se puede eliminar de esta función para evitar redundancia.
        result = db.users.insert_one(user_data)
        
        # Un resultado exitoso de PyMongo tendrá un `inserted_id`.
        # Si la operación no fue reconocida (`acknowledged`), consideramos que falló.
        if result.acknowledged:
            return result
        else:
            print("Fallo en la inserción del usuario: la operación no fue reconocida por la base de datos.")
            return None
    except Exception as e:
        # Capturar cualquier excepción durante la inserción (ej. problemas de conexión).
        print(f"Error al crear usuario en la base de datos: {e}")
        return None

def get_properties():
    """Recupera todas las propiedades y les adjunta la información del asesor."""
    db = get_database()
    if db is not None:
        pipeline = [
            {
                '$addFields': {
                    'id': { '$toString': '$_id' }
                }
            },
            {
                '$lookup': {
                    'from': 'users', 
                    'localField': 'agentCode', 
                    'foreignField': 'agentCode', 
                    'as': 'agentDetails'
                }
            }, 
            {
                '$unwind': {
                    'path': '$agentDetails', 
                    'preserveNullAndEmptyArrays': True
                }
            },
            {
                '$project': {
                    '_id': 0  # Excluir el campo _id original
                }
            }
        ]
        properties = list(db.properties.aggregate(pipeline))
        return properties
    return None

# Adding this function back from the previous task
def get_advisors():
    """Recupera todos los usuarios con el rol 'asesor'."""
    db = get_database()
    if db is not None:
        advisors = []
        for advisor in db.users.find({"role": "asesor"}):
            advisor['_id'] = str(advisor['_id'])
            advisors.append(advisor)
        return advisors
    return None

def update_user_to_advisor(username: str):
    """Updates a user's role to 'asesor'."""
    db = get_database()
    if db is not None:
        user = get_user(username)
        if not user:
            return None

        result = db.users.update_one(
            {"username": username},
            {"$set": {"role": "asesor"}}
        )
        return result.modified_count > 0
    return False

def create_property(property_data: dict):
    """Crea una nueva propiedad en la base de datos."""
    db = get_database()
    if db is not None:
        return db.properties.insert_one(property_data)
    return None

def add_favorite(username: str, property_id: str):
    """Agrega una propiedad a la lista de favoritos de un usuario."""
    db = get_database()
    if db is not None:
        # Usamos $addToSet para evitar duplicados
        result = db.users.update_one(
            {"username": username},
            {"$addToSet": {"favorites": property_id}}
        )
        return result.modified_count > 0
    return False

def remove_favorite(username: str, property_id: str):
    """Elimina una propiedad de la lista de favoritos de un usuario."""
    db = get_database()
    if db is not None:
        result = db.users.update_one(
            {"username": username},
            {"$pull": {"favorites": property_id}}
        )
        return result.modified_count > 0
    return False

def get_user_favorites(username: str):
    """Obtiene la lista de IDs de propiedades favoritas de un usuario."""
    db = get_database()
    if db is not None:
        user = db.users.find_one({"username": username})
        if user and "favorites" in user:
            return user["favorites"]
    return []

def get_property_by_id(property_id: str):
    """Busca una propiedad por su ID."""
    db = get_database()
    if db is not None:
        try:
            obj_id = ObjectId(property_id)
            return db.properties.find_one({"_id": obj_id})
        except Exception:
            return None
    return None

def update_property(property_id: str, data: dict):
    """Actualiza una propiedad existente."""
    db = get_database()
    if db is not None:
        try:
            obj_id = ObjectId(property_id)
            result = db.properties.update_one({"_id": obj_id}, {"$set": data})
            return result.modified_count > 0
        except Exception:
            return False
    return False

def get_advisor_by_code(agent_code: str):
    """Busca un asesor por su código de agente, manejando inconsistencias de nombres de campo."""
    db = get_database()
    if db is not None:
        # Busca usando 'agentCode' (preferido) o 'advisor_code' (fallback) para robustez.
        query = {
            "role": "asesor",
            "$or": [
                {"agentCode": agent_code},
                {"advisor_code": agent_code}
            ]
        }
        advisor = db.users.find_one(query)
        if advisor:
            advisor['_id'] = str(advisor['_id'])
            if 'password' in advisor:
                del advisor['password']
        return advisor
    return None

def search_users_by_username(query: str):
    """Busca usuarios por nombre de usuario parcial y sin distinción de mayúsculas/minúsculas."""
    db = get_database()
    if db is not None:
        users = []
        # Usamos una expresión regular para la búsqueda parcial e insensible a mayúsculas
        regex = {"$regex": query, "$options": "i"}
        for user in db.users.find({"username": regex}):
            user['_id'] = str(user['_id'])
            # Es importante no devolver el hash de la contraseña
            if 'password' in user:
                del user['password']
            users.append(user)
        return users
    return []

def update_user_role(user_id: str, role: str):
    """Actualiza el rol de un usuario."""
    db = get_database()
    if db is not None:
        if role not in ["user", "admin", "asesor"]:
            return False  # Rol no válido
        try:
            obj_id = ObjectId(user_id)
            result = db.users.update_one(
                {"_id": obj_id},
                {"$set": {"role": role}}
            )
            return result.modified_count > 0
        except Exception:
            return False
    return False

def get_user_by_id(user_id: str):
    """Busca un usuario por su ID."""
    db = get_database()
    if db is not None:
        try:
            return db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None
    return None

def update_username(user_id: str, new_username: str):
    """Actualiza el nombre de usuario de un usuario."""
    db = get_database()
    if db is not None:
        if db.users.find_one({"username": new_username}):
            return None
        
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"username": new_username}}
        )
        return result.modified_count > 0
    return False

def update_password(user_id: str, new_password_hash: str):
    """Actualiza la contraseña de un usuario."""
    db = get_database()
    if db is not None:
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": new_password_hash}}
        )
        return result.modified_count > 0
    return False

def update_user_contact_info(user_id: str, contact_info: dict):
    """Actualiza la información de contacto de un usuario."""
    db = get_database()
    if db is not None:
        try:
            update_data = {f"contactInfo.{key}": value for key, value in contact_info.items() if value}
            if not update_data:
                return True
            result = db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception:
            return False
    return False

def update_user_profile_image(user_id: str, image_url: str):
    """Actualiza la URL de la imagen de perfil de un usuario."""
    db = get_database()
    if db is not None:
        try:
            result = db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"profileImageUrl": image_url}}
            )
            return result.modified_count > 0
        except Exception:
            return None
    return None

def delete_property_by_id(property_id: str):
    """Elimina una propiedad por su ID."""
    db = get_database()
    if db is not None:
        try:
            obj_id = ObjectId(property_id)
            result = db.properties.delete_one({"_id": obj_id})
            return result.deleted_count > 0
        except Exception:
            return False
    return False