import os


class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "imdb_db")
    MAX_CONTENT_LENGTH = 1 * 1024 * 1024 * 1024  # 1GB
    UPLOAD_CHUNK_SIZE = 10000  # rows per batch insert
