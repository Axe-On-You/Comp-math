import numpy as np
from app.services.functions import SYSTEMS

def solve_system_iteration(sys_id, x0, y0, eps):
    s = SYSTEMS[sys_id]
    
    # Расчет q для информации
    try:
        q = max(
            abs(s["dphi1_dx"](x0, y0, x0)) + abs(s["dphi1_dy"](x0, y0, x0)),
            abs(s["dphi2_dx"](x0, y0, y0)) + abs(s["dphi2_dy"](x0, y0, y0))
        )
        err_msg = f"q = {q:.4f}" if q >= 1 else None
    except:
        err_msg = "Не удалось проверить сходимость"

    x_prev, y_prev = x0, y0
    steps = []
    
    for k in range(1, 101):
        x_curr = s["phi1"](x_prev, y_prev, x0)
        y_curr = s["phi2"](x_prev, y_prev, y0)
        
        dx, dy = abs(x_curr - x_prev), abs(y_curr - y_prev)
        
        steps.append({
            "k": k, "x": x_curr, "y": y_curr,
            "delta_x": dx, "delta_y": dy,
            "res1": s["f1"](x_curr, y_curr),
            "res2": s["f2"](x_curr, y_curr)
        })
        
        if max(dx, dy) < eps:
            return True, x_curr, y_curr, k, steps, err_msg
            
        x_prev, y_prev = x_curr, y_curr
        if max(dx, dy) > 1e6: break
            
    return False, None, None, len(steps), steps, (err_msg or "Метод расходится")