from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from models import SLAERequest
from solver import GaussSolver

app = FastAPI(
    title="СЛАУ: Метод Гаусса",
    description="API для решения СЛАУ методом Гаусса"
)

# Настройка CORS для взаимодействия с Frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене тут указывают конкретный домен, но для лабы оставляем "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/solve")
def solve_slae(request: SLAERequest):
    try:
        # 1. Решение нашим написанным методом Гаусса
        solver = GaussSolver(request.matrix_a, request.vector_b)
        gauss_result = solver.solve()
        
        # Вычисление вектора невязок r = Ax - b
        residuals = solver.get_residuals(
            x_solution=gauss_result["solution"], 
            original_a=request.matrix_a, 
            original_b=request.vector_b
        )

        # 2. Решение встроенной библиотекой NumPy для сравнения результатов
        np_a = np.array(request.matrix_a, dtype=float)
        np_b = np.array(request.vector_b, dtype=float)
        
        np_solution = np.linalg.solve(np_a, np_b).tolist()
        np_det = float(np.linalg.det(np_a))

        # 3. Формирование итогового ответа для фронтенда
        return {
            "method_results": {
                "triangular_matrix": gauss_result["triangular_matrix"],
                "solution": gauss_result["solution"],
                "determinant": gauss_result["determinant"],
                "residuals": residuals
            },
            "library_results": {
                "solution": np_solution,
                "determinant": np_det
            }
        }
        
    except np.linalg.LinAlgError:
        raise HTTPException(
            status_code=400, 
            detail="Матрица вырожденная (определитель равен 0). NumPy не может найти уникальное решение."
        )
    except ValueError as e:
        # Перехватываем ошибки из нашего solver.py (например, если нет решений)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")