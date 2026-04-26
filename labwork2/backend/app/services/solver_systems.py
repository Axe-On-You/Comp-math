import numpy as np
from app.services.functions import SYSTEMS

def solve_system_iteration(sys_id, x0, y0, eps):
    s = SYSTEMS[sys_id]
    warnings =[]
    
    try:
        dx1 = s["dphi1_dx"](x0, y0, x0)
        dy1 = s["dphi1_dy"](x0, y0, x0)
        dx2 = s["dphi2_dx"](x0, y0, y0)
        dy2 = s["dphi2_dy"](x0, y0, y0)

        norm1 = max(abs(dx1) + abs(dy1), abs(dx2) + abs(dy2))
        norm2 = max(abs(dx1) + abs(dx2), abs(dy1) + abs(dy2))
        
        q = min(norm1, norm2)
        
        if q >= 1:
            warnings.append(f"Условие сходимости не выполнено (q = {q:.4f} >= 1). Метод может расходиться.")
        else:
            warnings.append(f"Условие сходимости выполнено: q = {q:.4f}, norm1 = {norm1:.4f}, norm2 = {norm2:.4f}")
    except Exception:
        warnings.append("Не удалось рассчитать условие сходимости в начальной точке (возможно, деление на ноль).")

    x_prev, y_prev = x0, y0
    steps = []
    success = False
    res_x, res_y = None, None
    
    for k in range(1, 101):
        try:
            x_curr = s["phi1"](x_prev, y_prev, x0)
            y_curr = s["phi2"](x_prev, y_prev, y0)
            
            if np.isnan(x_curr) or np.isnan(y_curr) or abs(x_curr) > 1e10 or abs(y_curr) > 1e10:
                return False, None, None, k, steps, " ".join(warnings + ["Метод разошелся: значения улетели в бесконечность (Overflow)."])
            
            dx, dy = abs(x_curr - x_prev), abs(y_curr - y_prev)
            
            steps.append({
                "k": k, "x": x_curr, "y": y_curr,
                "delta_x": dx, "delta_y": dy,
                "res1": s["f1"](x_curr, y_curr),
                "res2": s["f2"](x_curr, y_curr)
            })
            
            if max(dx, dy) < eps:
                success = True
                res_x, res_y = x_curr, y_curr
                break
                
            x_prev, y_prev = x_curr, y_curr
            
        except Exception:
            return False, None, None, k, steps, " ".join(warnings + ["Критическая ошибка вычислений (возможно, выход за ОДЗ)."])
            
    err_msg = " ".join(warnings) if warnings else None
    if not success:
        err_msg = (err_msg or "") + " Метод не сошелся за 100 итераций."
        
    return success, res_x, res_y, len(steps), steps, err_msg.strip() if err_msg else None