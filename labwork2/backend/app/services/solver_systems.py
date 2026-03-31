import numpy as np
from app.services.functions import SYSTEMS

def solve_system_iteration(sys_id, x0, y0, eps):
    sys = SYSTEMS[sys_id]
    phi1, phi2 = sys["phi1"], sys["phi2"]
    dphi1_dx = sys.get("dphi1_dx")
    dphi1_dy = sys.get("dphi1_dy")
    dphi2_dx = sys.get("dphi2_dx")
    dphi2_dy = sys.get("dphi2_dy")
    
    if all([dphi1_dx, dphi1_dy, dphi2_dx, dphi2_dy]):
        try:
            row1 = abs(dphi1_dx(x0, y0)) + abs(dphi1_dy(x0, y0))
            row2 = abs(dphi2_dx(x0, y0)) + abs(dphi2_dy(x0, y0))
            q = max(row1, row2)
            
            if q >= 1:
                return False, None, None, 0, [], f"Условие сходимости не выполнено (q = {q:.3f} >= 1)"
        except Exception as e:
            pass

    x_prev, y_prev = x0, y0
    steps = []
    
    for k in range(1, 101):
        try:
            x_curr = phi1(x_prev, y_prev)
            y_curr = phi2(x_prev, y_prev)
        except:
            return False, None, None, k, steps, "Ошибка вычисления (выход за ОДЗ)"
            
        delta_x = abs(x_curr - x_prev)
        delta_y = abs(y_curr - y_prev)
        max_delta = max(delta_x, delta_y)
        
        steps.append({
            "k": k, 
            "x": x_curr, 
            "y": y_curr, 
            "delta_x": delta_x, 
            "delta_y": delta_y,
            "max_delta": max_delta
        })
        
        if max_delta <= eps:
            return True, x_curr, y_curr, k, steps, None
            
        x_prev, y_prev = x_curr, y_curr
        
    return False, None, None, 100, steps, "Превышено число итераций (процесс расходится)"