import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

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