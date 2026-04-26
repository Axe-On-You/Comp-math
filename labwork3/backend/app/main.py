import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as integration_router
from app.core.config import settings

app = FastAPI(
    title="Computational Mathematics - Lab 3 API",
    description="API для численного интегрирования функций различными методами",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутер с эндпоинтами для интегрирования
app.include_router(integration_router, prefix="/api", tags=["Integration"])

@app.get("/")
async def root():
    return {
        "message": "Backend для ЛР №3 запущен.",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)