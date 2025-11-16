import os
import sys

# Force UTF-8
if sys.platform == "win32":
    os.environ["PYTHONUTF8"] = "1"
    os.environ["PYTHONIOENCODING"] = "utf-8"

print("Python encoding:", sys.getdefaultencoding())
print("File system encoding:", sys.getfilesystemencoding())

try:
    from app.core.config import settings

    print("\nDatabase URL from settings:")
    print(settings.DATABASE_URL)
    print("\nURL length:", len(settings.DATABASE_URL))

    # Check each character around position 69
    if len(settings.DATABASE_URL) > 69:
        print(f"\nCharacters around position 69:")
        start = max(0, 69 - 10)
        end = min(len(settings.DATABASE_URL), 69 + 10)
        print(f"Position {start}-{end}: {settings.DATABASE_URL[start:end]!r}")
        print(
            f"Character at 69: {settings.DATABASE_URL[69]!r} (ord={ord(settings.DATABASE_URL[69])})"
        )

    # Try to connect
    print("\nAttempting psycopg2 connection...")
    import psycopg2

    # Parse URL manually
    from urllib.parse import urlparse

    parsed = urlparse(settings.DATABASE_URL)
    print(f"Scheme: {parsed.scheme}")
    print(f"Username: {parsed.username}")
    print(f"Password: {parsed.password}")
    print(f"Hostname: {parsed.hostname}")
    print(f"Port: {parsed.port}")
    print(f"Database: {parsed.path[1:]}")
    print(f"Query: {parsed.query}")

    # Try direct connection
    import getpass

    password = getpass.getpass("PostgreSQL password: ")
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port,
        user=parsed.username,
        password=password,
        dbname=parsed.path[1:].split("?")[0],
        client_encoding="utf8",
        options="-c client_encoding=UTF8",
    )
    print("\nConnection successful!")
    conn.close()

except Exception as e:
    import traceback

    print("\nError occurred:")
    print(traceback.format_exc())

    # Try to identify the problematic byte
    if "position 69" in str(e):
        print("\nTrying to identify the byte at position 69...")
        try:
            # Check environment variables
            for key, value in os.environ.items():
                if "PG" in key.upper() or "POSTGRES" in key.upper():
                    print(f"{key}={value!r}")
        except:
            pass
