from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.core.config import get_settings
import os
import sys

# Force UTF-8 encoding for Windows
if sys.platform == "win32":
    os.environ["PYTHONUTF8"] = "1"
    os.environ["PYTHONIOENCODING"] = "utf-8"
    # Force Python's default encoding
    import locale

    locale.getpreferredencoding = lambda: "UTF-8"

settings = get_settings()

# Get database URL based on environment
database_url = settings.get_database_url()

# Create engine with explicit connection parameters to avoid DSN parsing issues
from urllib.parse import urlparse

parsed_url = urlparse(database_url)

# Build connection URL with minimal parameters
connection_url = f"postgresql+psycopg2://{parsed_url.username}:{parsed_url.password}@{parsed_url.hostname}:{parsed_url.port}/{parsed_url.path.lstrip('/').split('?')[0]}"

engine = create_engine(
    connection_url,
    pool_pre_ping=True,
    connect_args={
        "options": "-c search_path=yoga_reserve",
        "client_encoding": "utf8",
    },
    poolclass=NullPool,  # Disable connection pooling to avoid encoding issues
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """データベースセッションを取得"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
