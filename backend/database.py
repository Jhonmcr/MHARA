import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
from bson import ObjectId

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client: MongoClient | None = None

def connect_to_mongo():
    """Establece la conexión con MongoDB."""
    global client
    if not MONGO_URI:
        raise EnvironmentError("La variable de entorno MONGO_URI no está configurada.")
    
    try:
        client = MongoClient(MONGO_URI)
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
    """Retorna la instancia de la base de datos."""
    if client:
        return client.get_database("Cluster0")
    return None

def get_user(username: str):
    """Busca un usuario por su nombre de usuario en la base de datos."""
    db = get_database()
    if db is not None:
        return db.users.find_one({"username": username})
    return None

def create_user(user_data: dict):
    """Crea un nuevo usuario en la base de datos."""
    db = get_database()
    if db is not None:
        existing_user = get_user(user_data["username"])
        if existing_user:
            return None
        return db.users.insert_one(user_data)
    return None

def get_properties():
    """Recupera todas las propiedades de la colección 'properties'."""
    db = get_database()
    if db is not None:
        properties = []
        for prop in db.properties.find():
            prop['id'] = str(prop['_id'])
            del prop['_id']
            properties.append(prop)
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

def update_user_to_advisor(username: str, advisor_code: str):
    """Updates a user's role to 'asesor' and adds an advisor code."""
    db = get_database()
    if db is not None:
        # Check if the user exists first
        user = get_user(username)
        if not user:
            return None # Or raise an exception

        result = db.users.update_one(
            {"username": username},
            {"$set": {"role": "asesor", "advisor_code": advisor_code}}
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