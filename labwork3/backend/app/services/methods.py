from typing import Callable

def left_rectangles(f: Callable[[float], float], a: float, b: float, n: int) -> float:
    h = (b - a) / n
    return h * sum(f(a + i * h) for i in range(n))

def right_rectangles(f: Callable[[float], float], a: float, b: float, n: int) -> float:
    h = (b - a) / n
    return h * sum(f(a + i * h) for i in range(1, n + 1))

def middle_rectangles(f: Callable[[float], float], a: float, b: float, n: int) -> float:
    h = (b - a) / n
    return h * sum(f(a + h * (i - 0.5)) for i in range(1, n + 1))

def trapezoid(f: Callable[[float], float], a: float, b: float, n: int) -> float:
    h = (b - a) / n
    s = sum(f(a + i * h) for i in range(1, n))
    return h * ((f(a) + f(b)) / 2 + s)

def simpson(f: Callable[[float], float], a: float, b: float, n: int) -> float:
    # Метод Симпсона требует четного количества интервалов
    if n % 2 != 0:
        n += 1
        
    h = (b - a) / n
    s1 = sum(f(a + i * h) for i in range(1, n, 2))  # Нечетные узлы
    s2 = sum(f(a + i * h) for i in range(2, n, 2))  # Четные узлы
    
    return (h / 3) * (f(a) + f(b) + 4 * s1 + 2 * s2)

# Карта методов с указанием порядка точности p
METHODS_MAP = {
    "left": {"func": left_rectangles, "p": 1},
    "right": {"func": right_rectangles, "p": 1},
    "middle": {"func": middle_rectangles, "p": 2},
    "trapezoid": {"func": trapezoid, "p": 2},
    "simpson": {"func": simpson, "p": 4},
}