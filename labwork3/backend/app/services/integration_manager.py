import math
from app.services.functions import FUNCTIONS
from app.services.methods import METHODS_MAP

def find_singularities(f, a, b, steps=2000):
    """
    Сканирует отрезок и ищет точки, где функция не определена 
    или стремится к бесконечности.
    """
    singularities = []
    delta = (b - a) / steps
    threshold = 1e6

    for i in range(steps + 1):
        x = a + i * delta
        try:
            y = abs(f(x))
            if y > threshold or math.isinf(y) or math.isnan(y):
                singularities.append(x)
        except (ValueError, ZeroDivisionError, OverflowError):
            singularities.append(x)
            
    # Убираем дубликаты, которые стоят слишком близко друг к другу
    unique_sings = []
    if singularities:
        unique_sings.append(singularities[0])
        for s in singularities[1:]:
            if abs(s - unique_sings[-1]) > delta * 2:
                unique_sings.append(s)
                
    return unique_sings

def is_divergent(f, sing_point, a, b):
    """
    Проверка сходимости по показателю степени p (1/|x-c|^p).
    Проверяем с обеих сторон, если они входят в диапазон [a, b].
    """
    eps1 = 1e-6
    eps2 = 1e-7
    def get_p(point):
        try:
            y1 = abs(f(point + eps1))
            y2 = abs(f(point + eps2))
            if y1 == 0: return 0
            return math.log10(y2 / y1)
        except:
            return 2.0 # Если ошибка в окрестности — считаем расходящимся

    # Проверяем справа (если не выходим за b)
    if sing_point < b:
        if get_p(sing_point) >= 0.99: return True
        
    # Проверяем слева (если не выходим за a)
    if sing_point > a:
        # Для левой стороны eps должны быть отрицательными
        try:
            y1 = abs(f(sing_point - eps1))
            y2 = abs(f(sing_point - eps2))
            if y1 != 0 and math.log10(y2 / y1) >= 0.99: return True
        except:
            return True
            
    return False

def _calc_segment(f, calc_func, a, b, epsilon, p):
    if abs(b - a) < 1e-12: return 0.0, 1, 0.0

    n = 4
    # Правило Рунге требует начального значения
    I_n = calc_func(f, a, b, n)
    error = float('inf')
    max_iterations = 18
    
    for _ in range(max_iterations):
        n *= 2
        I_2n = calc_func(f, a, b, n)
        error = abs(I_2n - I_n) / ((2 ** p) - 1)
        I_n = I_2n
        if error <= epsilon:
            break
    return I_n, n, error

def integrate(func_id: int, method_name: str, a: float, b: float, epsilon: float):
    f_data = FUNCTIONS.get(func_id)
    f = f_data["func"]
    method_data = METHODS_MAP.get(method_name)
    calc_func = method_data["func"]
    p_method = method_data["p"]

    # 1. Смена пределов
    sign = 1
    if a > b:
        a, b = b, a
        sign = -1
    
    # 2. Автоматический поиск точек разрыва
    sings = find_singularities(f, a, b)
    
    # 3. Проверка на сходимость каждой найденной точки
    for s in sings:
        if is_divergent(f, s, a, b):
            raise ValueError(f"Интеграл расходится (не существует) в окрестности x ≈ {round(s, 4)}")
        
    # 4. Разбиение на интервалы (обход разрывов)
    offset = 1e-8 
    intervals = []
    curr = a
    for s in sorted(sings):
        if s > curr + offset:
            intervals.append((curr, s - offset))
        curr = s + offset
    if curr < b - 1e-10:
        intervals.append((curr, b))

    if not intervals and a != b:
        intervals = [(a, b)]

    # 5. Вычисление
    res_total, n_total, err_total = 0.0, 0, 0.0
    seg_eps = epsilon / (len(intervals) if intervals else 1)

    for start, end in intervals:
        try:
            val, n, err = _calc_segment(f, calc_func, start, end, epsilon/len(intervals), p_method)
            res_total += val
            n_total += n
            err_max = max(err_max, err)
        except:
            raise ValueError("Ошибка при вычислении на сходящемся участке.")
        
    # 6. Точки для графика
    graph = []
    for i in range(201):
        x_p = a + i * (b - a) / 200
        try:
            y_p = f(x_p)
            if abs(y_p) < 50: # Чтобы график не улетал в космос
                graph.append({"x": x_p, "y": y_p})
            else:
                graph.append({"x": x_p, "y": 50 if y_p > 0 else -50})
        except:
            continue

    return {
        "result": res_total * sign,
        "n": n_total,
        "error": err_total,
        "graph_points": graph
    }