import math

def f1(x: float) -> float:
    return -x**3 - x**2 - 2*x + 1

def f2(x: float) -> float:
    return math.sin(x) + math.cos(x)

def f3(x: float) -> float:
    # Защита от деления на 0
    if abs(x) < 1e-12:
        raise ValueError("Функция терпит разрыв при x = 0")
    return 1 / x

def f4(x: float) -> float:
    if x <= 0:
        raise ValueError("Функция логарифма не определена при x <= 0")
    return (x**2) * math.log(x)

def f5(x: float) -> float:
    return 2*x**3 - 3*x**2 + 5*x - 9

# Разрыв в x = 0. СХОДИТСЯ
def f6(x: float) -> float: 
    return 1 / math.sqrt(abs(x))

# Разрыв в x = 0. РАСХОДИТСЯ
def f7(x: float) -> float: 
    return 1 / (x**2)

# Разрыв в x = 0. СХОДИТСЯ
def f8(x: float) -> float: 
    return 1 / math.sqrt(abs(x - 2))

# Словарь для быстрого доступа по ID
FUNCTIONS = {
    1: { "func": f1, "latex": "-x^3 - x^2 - 2x + 1" },
    2: { "func": f2, "latex": "\\sin(x) + \\cos(x)" },
    3: { "func": f3, "latex": "1 / x" }, 
    4: { "func": f4, "latex": "x^2 \\ln(x)" },
    5: { "func": f5, "latex": "2x^3 - 3x^2 + 5x - 9" },
    
    6: { "func": f6, "latex": "1 / \\sqrt{|x|}" },
    7: { "func": f7, "latex": "1 / x^2" },
    8: { "func": f8, "latex": "1 / \\sqrt{|x - 2|}" }
}