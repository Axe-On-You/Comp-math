from fastapi import APIRouter, HTTPException
from app.models.schemas import IntegrationRequest, IntegrationResponse
from app.services.integration_manager import integrate

router = APIRouter()

@router.post("/integrate", response_model=IntegrationResponse)
def calculate_integral(req: IntegrationRequest):
    try:
        # Извлекаем значения из Pydantic модели
        result_dict = integrate(
            func_id=req.function_id,
            method_name=req.method.value,
            a=req.a,
            b=req.b,
            epsilon=req.epsilon
        )
        return result_dict
    except ValueError as e:
        # Если функция не определена или введена дичь — отдаём 400
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")