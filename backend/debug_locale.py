import os
import sys
import locale

print("=== System Locale Information ===")
print(f"Default encoding: {sys.getdefaultencoding()}")
print(f"File system encoding: {sys.getfilesystemencoding()}")
print(f"Preferred encoding: {locale.getpreferredencoding()}")
print(f"Default locale: {locale.getdefaultlocale()}")

print("\n=== PostgreSQL Environment Variables ===")
pg_vars = {}
for key, value in os.environ.items():
    if any(
        x in key.upper() for x in ["PG", "POSTGRES", "PSQL", "APPDATA", "HOME", "USER"]
    ):
        pg_vars[key] = value
        print(f"{key}={value}")

print("\n=== Attempting connection with different methods ===")

# Method 1: Direct parameters (no DSN string)
try:
    import psycopg2

    print("\n1. Trying direct connection with parameters...")
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="postgres",
        database="yoga_reserve",
        client_encoding="UTF8",
    )
    print("✓ SUCCESS with direct parameters!")

    # Test query
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"PostgreSQL version: {version[0][:50]}...")
    cur.close()
    conn.close()

except Exception as e:
    print(f"✗ FAILED: {e}")

# Method 2: Using libpq environment variables
print("\n2. Checking libpq.dll location...")
try:
    import psycopg2
    import ctypes.util

    libpq_path = ctypes.util.find_library("libpq")
    if libpq_path:
        print(f"libpq found at: {libpq_path}")
        # Check if path contains non-ASCII characters
        try:
            libpq_path.encode("ascii")
            print("✓ Path is ASCII-safe")
        except UnicodeEncodeError:
            print(f"✗ Path contains non-ASCII characters!")
    else:
        print("libpq not found via ctypes")

    # Check psycopg2 installation path
    import psycopg2

    psycopg2_path = psycopg2.__file__
    print(f"\npsycopg2 location: {psycopg2_path}")
    try:
        psycopg2_path.encode("ascii")
        print("✓ psycopg2 path is ASCII-safe")
    except UnicodeEncodeError:
        print(f"✗ psycopg2 path contains non-ASCII characters!")

except Exception as e:
    print(f"Error: {e}")

# Method 3: Check APPDATA path (often causes issues on Japanese Windows)
print("\n3. Checking Windows user paths...")
appdata = os.environ.get("APPDATA", "")
localappdata = os.environ.get("LOCALAPPDATA", "")
userprofile = os.environ.get("USERPROFILE", "")

for name, path in [
    ("APPDATA", appdata),
    ("LOCALAPPDATA", localappdata),
    ("USERPROFILE", userprofile),
]:
    if path:
        print(f"{name}: {path}")
        try:
            path.encode("ascii")
            print(f"  ✓ ASCII-safe")
        except UnicodeEncodeError:
            print(f"  ✗ Contains non-ASCII characters!")
            print(f"  Bytes: {path.encode('utf-8')}")
