from passlib.context import CryptContext

# Se crea un contexto de criptografía, especificando el esquema de hashing.
# "bcrypt" es una elección fuerte y recomendada.
# El parámetro "deprecated="auto"" se asegura de que las contraseñas antiguas
# se actualicen automáticamente a un nuevo hash si se cambia el esquema.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """
    Verifica si una contraseña en texto plano coincide con un hash existente.
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    """
    Hashea una contraseña en texto plano.
    """
    return pwd_context.hash(password)
