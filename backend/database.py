import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise EnvironmentError("La variable de entorno MONGO_URI no está configurada.")

client = MongoClient(MONGO_URI)

# Intentar conectar a la base de datos para verificar la conexión
try:
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("Conexión a MongoDB exitosa.")
except ConnectionFailure:
    print("Error en la conexión a MongoDB.")
    # Considera manejar el error de forma más robusta, por ejemplo, saliendo de la aplicación.
    client = None

def get_database():
    """
    Retorna la instancia de la base de datos.
    El nombre de la base de datos se puede obtener de la URI o especificar aquí.
    """
    if client:
        # Se especifica el nombre de la base de datos directamente.
        # En un futuro, esto podría venir de una variable de entorno.
        return client.get_database("Cluster0")
    return None

def get_user(username: str):
    """
    Busca un usuario por su nombre de usuario en la base de datos.
    """
    db = get_database()
    if db is not None:
        return db.users.find_one({"username": username})
    return None

def create_user(user_data: dict):
    """
    Crea un nuevo usuario en la base de datos.
    Espera que la contraseña ya esté hasheada.
    """
    db = get_database()
    if db is not None:
        # Aquí podrías añadir lógica para evitar duplicados si lo necesitas
        # Por ejemplo, comprobando si ya existe un usuario con ese email o username
        existing_user = get_user(user_data["username"])
        if existing_user:
            return None # O lanzar una excepción específica
        
        return db.users.insert_one(user_data)
    return None

def get_properties():
    """
    Recupera todas las propiedades de la colección 'properties'.
    """
    db = get_database()
    if db is not None:
        properties = []
        for prop in db.properties.find():
            prop['id'] = str(prop['_id'])  # Renombrar _id a id
            del prop['_id']  # Eliminar el campo original _id
            properties.append(prop)
        return properties
    return None

def close_mongo_connection():
    """Cierra la conexión a MongoDB."""
    if client:
        client.close()
        print("Conexión a MongoDB cerrada.")
