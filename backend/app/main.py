from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.router import api_router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# CORS設定(ルーター登録より前に追加)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# ルーター登録
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {"message": "Yoga Reservation API", "status": "running"}


@app.get("/debug/config")
def debug_config():
    return {
        "cors_origins": settings.CORS_ORIGINS,
        "cors_type": type(settings.CORS_ORIGINS).__name__,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
