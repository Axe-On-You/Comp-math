import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import equations, systems
from app.core.config import settings

app = FastAPI(title="CompMath Lab 2 API")

# Настройка CORS, чтобы React мог достучаться до API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры с префиксами
app.include_router(equations.router, prefix="/api/equations", tags=["equations"])
app.include_router(systems.router, prefix="/api/systems", tags=["systems"])

@app.get("/")
async def root():
    return {"message": "Backend is running. Use /docs for Swagger UI."}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)