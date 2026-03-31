import numpy as np

def check_convergence_iteration(df_func, a, b):
    """
    Проверка условия сходимости для МПИ: |phi'(x)| < 1
    Здесь df_func — это производная phi(x).
    """
    points = np.linspace(a, b, 20)
    for x in points:
        if abs(df_func(x)) >= 1:
            return False
    return True

def has_root(f, a, b):
    """Проверка наличия корня на отрезке [a, b]"""
    return f(a) * f(b) <= 0