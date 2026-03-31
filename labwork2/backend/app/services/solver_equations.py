import numpy as np
from app.services.functions import EQUATIONS

def solve_by_chord(eq_id, a, b, eps): # Добавить Решение корень + 
    f = EQUATIONS[eq_id]["f"]
    steps = []
    x_prev = a
    # Метод хорд: x = a - f(a)*(b-a)/(f(b)-f(a))
    for k in range(1, 101):
        x_curr = a - f(a) * (b - a) / (f(b) - f(a))
        delta = max(abs(x_curr - x_prev), abs(f(x_curr)), abs(a - b))
        steps.append({"k": k, "x": x_curr, "f_x": f(x_curr), "delta": delta})
        
        if delta < eps:
            return True, x_curr, k, steps
        
        # Выбор новой границы
        if f(a) * f(x_curr) < 0: b = x_curr
        else: a = x_curr
        x_prev = x_curr
        
    return False, None, 100, steps

def solve_by_newton(eq_id, x0, eps):  # Добавсит вывод нач приблежения в прилодении
    f = EQUATIONS[eq_id]["f"]
    df = EQUATIONS[eq_id]["df"]
    steps = []
    x_prev = x0
    for k in range(1, 101):
        deriv = df(x_prev)
        if deriv == 0: return False, None, k, steps
        
        x_curr = x_prev - f(x_prev) / deriv
        delta = max(abs(x_curr - x_prev), abs(f(x_curr)), abs(f(x_curr) / df(x_curr)))
        steps.append({"k": k, "x": x_curr, "f_x": f(x_curr), "delta": delta})
        
        if delta < eps:
            return True, x_curr, k, steps
        x_prev = x_curr
        
    return False, None, 100, steps

def solve_by_iteration(eq_id, a, b, eps): # условие сходимости
    f = EQUATIONS[eq_id]["f"]
    df = EQUATIONS[eq_id]["df"]
    
    # Автоматический подбор lambda для сходимости phi(x) = x + lambda*f(x)
    # lambda = -1 / max|f'(x)| на [a, b]
    sample_x = np.linspace(a, b, 10)
    max_df = max(abs(df(x)) for x in sample_x)
    lambda_val = -1 / max_df if df(a) * df(b) else 1 / max_df
    
    phi = lambda x: x + lambda_val * f(x)
    
    x_prev = (a + b) / 2
    steps = []
    for k in range(1, 101):
        x_curr = phi(x_prev)
        delta = abs(x_curr - x_prev)
        steps.append({"k": k, "x": x_curr, "f_x": f(x_curr), "delta": delta})
        
        if delta < eps:
            return True, x_curr, k, steps
        x_prev = x_curr
        
    return False, None, 100, steps