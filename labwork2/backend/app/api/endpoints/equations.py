from fastapi import APIRouter, HTTPException, Query
from app.services.functions import EQUATIONS
import numpy as np
from app.schemas.request import EquationRequest
from app.schemas.response import EquationResponse
from app.services import solver_equations

router = APIRouter()

@router.post("/solve", response_model=EquationResponse)
async def solve_equation(req: EquationRequest): # Боже помилуй
    if req.method == 'chord':
        success, res, iters, steps, err = solver_equations.solve_by_chord(
            req.equation_id, req.a, req.b, req.epsilon
        )
    elif req.method == 'newton':
        success, res, iters, steps, err = solver_equations.solve_by_newton(
            req.equation_id, req.a, req.b, req.epsilon
        )
    elif req.method == 'iteration':
        success, res, iters, steps, err = solver_equations.solve_by_iteration(
            req.equation_id, req.a, req.b, req.epsilon
        )
    else:
        raise HTTPException(status_code=400, detail="Unknown method")
    
    return EquationResponse(
        success=success, 
        result=res, 
        iterations=iters, 
        steps=steps, 
        error=err
    )

@router.get("/plot")
async def get_plot_data(
    equation_id: int, 
    a: float = Query(default=-10.0), 
    b: float = Query(default=10.0)
):
    """
    Возвращает точки для построения графика функции.
    Если a и b переданы, график центрируется по ним.
    """
    if equation_id not in EQUATIONS:
        raise HTTPException(status_code=404, detail="Equation not found")
        
    f = EQUATIONS[equation_id]["f"]
    
    # Чтобы a и b не были прямо на краях графика, добавим "отступы" (margin) 20%
    if a < b:
        margin = (b - a) * 0.2
        plot_a, plot_b = a - margin, b + margin
    else:
        # Защита от случая, если пользователь ввел a >= b или еще только печатает
        plot_a, plot_b = a - 2, a + 2
        
    # Генерируем 100 точек для плавного графика
    x_points = np.linspace(plot_a, plot_b, 100)
    y_points = [f(x) for x in x_points]
    
    data = [{"x": round(float(x), 4), "y": round(float(y), 4)} for x, y in zip(x_points, y_points)]
    
    return {"data": data}