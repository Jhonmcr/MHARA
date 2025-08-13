# Archivo: backend/main.py
from fastapi import FastAPI
from database import get_database, close_mongo_connection, client  # Importa el cliente también
from pymongo.errors import ConnectionFailure

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    # Este evento se ejecuta cuando la aplicación se inicia.
    # La conexión ya se intenta establecer cuando se importa `database.py`.
    # Aquí podemos simplemente verificar que el cliente no sea None.
    if client is None:
        raise ConnectionFailure("No se pudo conectar a MongoDB al iniciar la aplicación.")
    app.mongodb = get_database()
    print("Conectado a la base de datos MongoDB y lista para usar.")

@app.on_event("shutdown")
async def shutdown_db_client():
    # Este evento se ejecuta cuando la aplicación se detiene.
    close_mongo_connection()
    print("La conexión a MongoDB ha sido cerrada.")

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
            # Enviar un comando ping para confirmar que la conexión está activa
            client.admin.command('ping')
            return {"status": "success", "message": "La conexión con MongoDB está activa."}
        except Exception as e:
            return {"status": "error", "message": f"No se pudo conectar a MongoDB: {e}"}
    else:
        return {"status": "error", "message": "El cliente de MongoDB no está inicializado."}