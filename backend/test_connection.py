import requests

try:
    response = requests.get("http://localhost:3001/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except requests.exceptions.ConnectionError:
    print("ERROR: Cannot connect to backend server at http://localhost:3001")
    print("Please make sure uvicorn server is running:")
    print("  uvicorn app.main:app --host localhost --port 3001 --reload")
except Exception as e:
    print(f"ERROR: {e}")
