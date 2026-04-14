import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
from fastapi import APIRouter, HTTPException, Query
import numpy as np
from app.services.functions import SYSTEMS
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
        success=success, 
        x=x, 
        y=y, 
        iterations=iters, 
        steps=steps, 
        error=err
    )

@router.get("/plot")
async def get_system_plot_data(
    system_id: int,
    x_center: float = Query(default=0.0),
    y_center: float = Query(default=0.0),
    range_val: float = Query(default=3.0)
):
    if system_id not in SYSTEMS:
        raise HTTPException(status_code=404, detail="System not found")
        
    s = SYSTEMS[system_id]
    
    num_points = 200
    x_space = np.linspace(x_center - range_val, x_center + range_val, num_points)
    y_space = np.linspace(y_center - range_val, y_center + range_val, num_points)
    X, Y = np.meshgrid(x_space, y_space)

    with np.errstate(divide='ignore', invalid='ignore'):
        Z1 = s["f1"](X, Y)
        Z2 = s["f2"](X, Y)

    Z1 = np.clip(Z1, -10, 10)
    Z2 = np.clip(Z2, -10, 10)

    def get_contour_points(x, y, z):
        fig, ax = plt.subplots() 
        try:
            cs = ax.contour(x, y, z, levels=[0])
            paths =[]
            if hasattr(cs, 'allsegs'):
                segments = cs.allsegs[0]
                for seg in segments:
                    valid_points = [
                        {"x": float(p[0]), "y": float(p[1])} 
                        for p in seg 
                        if np.isfinite(p[0]) and np.isfinite(p[1])
                    ]
                    if len(valid_points) > 5:
                        valid_points = valid_points[::3] + [valid_points[-1]]

                    if len(valid_points) > 1:
                        paths.append(valid_points)
            else:
                for collection in cs.collections:
                    for path in collection.get_paths():
                        v = path.vertices
                        valid_points =[
                            {"x": float(p[0]), "y": float(p[1])} 
                            for p in v 
                            if np.isfinite(p[0]) and np.isfinite(p[1])
                        ]
                        if len(valid_points) > 5:
                            valid_points = valid_points[::3] + [valid_points[-1]]
                        if len(valid_points) > 1:
                            paths.append(valid_points)
            return paths
        except Exception as e:
            print(f"Ошибка парсинга точек: {e}")
            return[]
        finally:
            plt.close(fig)
    try:
        line1 = get_contour_points(X, Y, Z1)
        line2 = get_contour_points(X, Y, Z2)
        return {
            "line1": line1,
            "line2": line2,
            "domain_x":[x_center - range_val, x_center + range_val],
            "domain_y":[y_center - range_val, y_center + range_val]
        }
    except Exception as e:
        print(f"ОШИБКА ГЕНЕРАЦИИ ГРАФИКА: {str(e)}")
        return {"error": str(e), "line1": [], "line2": []}