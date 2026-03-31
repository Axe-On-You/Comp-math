import numpy as np
from app.services.functions import EQUATIONS

def get_interval_warning(f, df, a, b):
    warnings = []
    
    if f(a) * f(b) > 0:
        warnings.append(f"На [{a}, {b}] знаки f(a) и f(b) одинаковы. Не выполняется необходимое условие существования корня. Корня может не быть или их несколько.")
    
    points = np.linspace(a, b, 50)
    df_values = [df(x) for x in points]
    initial_sign = np.sign(df_values[0])
    for val in df_values:
        if np.sign(val) != initial_sign and abs(val) > 1e-12:
            warnings.append(f"На отрезке [{a}, {b}] функция не монотонна. Не выполняется достаточное условие единственности корня.")
            break
            
    return warnings

def check_root_bounds(f, x, a, b, warnings, method_name):
    """Проверяет положение корня и добавляет развернутое пояснение, если он вне отрезка."""
    margin = 1e-9 
    if x is not None and not (min(a, b) - margin <= x <= max(a, b) + margin):
        if f(a) * f(b) < 0:
            warnings.append(
                f"Внимание: корень ({x:.5f}) вне отрезка. {method_name} не обладает локальной сходимостью "
                f"на данном отрезке или выбрано неудачное начальное приближение, из-за чего процесс сошелся к внешнему корню."
            )
        else:
            warnings.append(
                f"Внимание: корень ({x:.5f}) вне отрезка. На данном отрезке отсутствуют корни (или их четное количество), "
                f"метод закономерно сошелся к ближайшему внешнему корню."
            )
    return warnings

def solve_by_chord(eq_id, a, b, eps):
    f = EQUATIONS[eq_id]["f"]
    df = EQUATIONS[eq_id]["df"]
    d2f = EQUATIONS[eq_id]["d2f"]
    
    warnings = get_interval_warning(f, df, a, b)

    if f(a) * d2f(a) > 0:
        fixed, x_prev = a, b
    else:
        fixed, x_prev = b, a
    
    steps = []
    res_x = None
    success = False
    
    for k in range(1, 101):
        f_x_prev = f(x_prev)
        f_fixed = f(fixed)
        denominator = f_x_prev - f_fixed
        
        if abs(denominator) < 1e-15:
            return False, None, k, steps, " ".join(warnings + ["Критическая ошибка: деление на 0."])

        x_curr = x_prev - f_x_prev * (x_prev - fixed) / denominator
        delta = abs(x_curr - x_prev)
        steps.append({"k": k, "x": x_curr, "f_x": f(x_curr), "delta": delta})
        
        if delta < eps:
            success = True
            res_x = x_curr
            break
        x_prev = x_curr
        
    warnings = check_root_bounds(f, res_x, a, b, warnings, "Метод хорд")
    return success, res_x, len(steps), steps, " ".join(warnings) if warnings else None

def solve_by_newton(eq_id, a, b, eps, initial_x=None):
    f = EQUATIONS[eq_id]["f"]
    df = EQUATIONS[eq_id]["df"]
    d2f = EQUATIONS[eq_id]["d2f"]
    
    warnings = get_interval_warning(f, df, a, b)
    
    if initial_x is not None:
        x_prev = initial_x
    else:
        x_prev = a if f(a) * d2f(a) > 0 else b
        
    steps = []
    res_x = None
    success = False
    
    for k in range(1, 101):
        df_val = df(x_prev)
        if abs(df_val) < 1e-15:
            return False, None, k, steps, " ".join(warnings + ["Ошибка: производная 0."])
        
        x_curr = x_prev - f(x_prev) / df_val
        delta = abs(x_curr - x_prev)
        steps.append({"k": k, "x": x_curr, "f_x": f(x_curr), "delta": delta})
        
        if delta < eps:
            success = True
            res_x = x_curr
            break
        x_prev = x_curr
        
    warnings = check_root_bounds(f, res_x, a, b, warnings, "Метод Ньютона")
    return success, res_x, len(steps), steps, " ".join(warnings) if warnings else None

def solve_by_iteration(eq_id, a, b, eps):
    f = EQUATIONS[eq_id]["f"]
    df = EQUATIONS[eq_id]["df"]
    
    warnings = get_interval_warning(f, df, a, b)
    
    points = np.linspace(a, b, 100)
    df_values = [df(x) for x in points]
    max_df = max(abs(v) for v in df_values)
    
    mid_df = df((a + b) / 2)
    lambda_val = -1 / max_df if mid_df > 0 else 1 / max_df
    
    q = max(abs(1 + lambda_val * v) for v in df_values)
    if q >= 1:
        warnings.append(f"Условие сходимости МПИ не выполнено (q = {q:.3f} >= 1).")

    x_prev = a 
    steps = []
    res_x = None
    success = False

    for k in range(1, 101):
        try:
            x_curr = x_prev + lambda_val * f(x_prev)

            if np.isnan(x_curr) or np.isinf(x_curr) or abs(x_curr) > 1e15:
                    return False, None, k, steps, "Метод разошелся: значения стали слишком велики (Overflow)."
            
            delta = abs(x_curr - x_prev)
            steps.append({"k": k, "x": x_curr, "f_x": f(x_curr), "delta": delta})
            
            if delta < eps:
                success = True
                res_x = x_curr
                break
            x_prev = x_curr
            
        except OverflowError:
            return False, None, k, steps, "Ошибка переполнения при вычислении. МПИ не сходится на этом интервале."

    warnings = check_root_bounds(f, res_x, a, b, warnings, "Метод простой итерации")
    return success, res_x, len(steps), steps, " ".join(warnings) if warnings else None