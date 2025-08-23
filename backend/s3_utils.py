import os
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar configuración de AWS desde variables de entorno
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

# Validar que las variables de entorno estén configuradas
if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, AWS_REGION]):
    raise EnvironmentError("Las variables de entorno de AWS no están completamente configuradas.")

# Crear un cliente de S3 reutilizable
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def upload_file_to_s3(file, object_name: str, content_type: str) -> str | None:
    """
    Sube un archivo a un bucket de S3 y devuelve la URL pública.

    :param file: Archivo a subir (objeto tipo file).
    :param object_name: Nombre del objeto en S3 (incluyendo carpetas si es necesario).
    :param content_type: El tipo MIME del archivo (ej. 'image/jpeg').
    :return: La URL del archivo subido, o None si hubo un error.
    """
    try:
        s3_client.upload_fileobj(
            file,
            S3_BUCKET_NAME,
            object_name,
            ExtraArgs={'ContentType': content_type}
        )
        # Construir la URL del objeto
        # La URL puede variar según la configuración de la región y del bucket
        # Este es un formato común.
        file_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{object_name}"
        logger.info(f"Archivo subido exitosamente a S3. URL: {file_url}")
        return file_url
    except NoCredentialsError:
        logger.error("Error de credenciales: No se encontraron las credenciales de AWS.")
        return None
    except PartialCredentialsError:
        logger.error("Error de credenciales: Credenciales de AWS incompletas.")
        return None
    except ClientError as e:
        logger.error(f"Error del cliente de S3: {e}")
        return None
    except Exception as e:
        logger.error(f"Un error inesperado ocurrió al subir el archivo: {e}")
        return None
