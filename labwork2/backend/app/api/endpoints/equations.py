from fastapi import APIRouter, HTTPException
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