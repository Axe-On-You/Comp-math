from fastapi import APIRouter
from app.schemas.request import SystemRequest
from app.schemas.response import SystemResponse
from app.services import solver_systems

router = APIRouter()

@router.post("/solve", response_model=SystemResponse)
async def solve_system(req: SystemRequest):
    success, x, y, iters, steps, err = solver_systems.solve_system_iteration(
        req.system_id, req.x0, req.y0, req.epsilon
    )
    return SystemResponse(
        success=success, x=x, y=y, 
        iterations=iters, steps=steps, error=err
    )