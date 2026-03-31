import numpy as np

# --- Одиночные уравнения ---
# Уравнение 1: x³ - 1.89x² - 2x + 1.76 = 0
def f1(x): return x**3 - 1.89*x**2 - 2*x + 1.76
def df1(x): return 3*x**2 - 3.78*x - 2
def d2f1(x): return 6*x - 3.78

# Уравнение 2: x³ + 4.81x² - 17.37x + 5.38 = 0
def f2(x): return x**3 + 4.81*x**2 - 17.37*x + 5.38
def df2(x): return 3*x**2 + 9.62*x - 17.37
def d2f2(x): return 6*x + 9.62

EQUATIONS = {
    1: {"f": f1, "df": df1, "d2f": d2f1, "label": "x³ - 1.89x² - 2x + 1.76 = 0"},
    2: {"f": f2, "df": df2, "d2f": d2f2, "label": "x³ + 4.81x² - 17.37x + 5.38 = 0"}
}

# --- Системы уравнений ---
# Система: tg(xy + 0.2) = x², x² + 2y² = 1
def sys_f1(x, y): return np.tan(x * y + 0.2) - x**2
def sys_f2(x, y): return x**2 + 2 * y**2 - 1

# Преобразование для МПИ (выражаем x и y)
# Важно: используем sign(x0), чтобы находить разные корни
def sys_phi1(x, y, x0):
    val = np.tan(x * y + 0.2)
    return np.sign(x0) * np.sqrt(np.abs(val))

def sys_phi2(x, y, y0):
    val = (1 - x**2) / 2
    return np.sign(y0) * np.sqrt(np.abs(val))

# Частные производные phi по x и y (для проверки условия сходимости)
def dphi1_dx(x, y, x0):
    denom = 2 * np.sqrt(np.abs(np.tan(x*y + 0.2))) * (np.cos(x*y + 0.2)**2)
    return np.sign(x0) * y / denom if denom != 0 else 0

def dphi1_dy(x, y, x0):
    denom = 2 * np.sqrt(np.abs(np.tan(x*y + 0.2))) * (np.cos(x*y + 0.2)**2)
    return np.sign(x0) * x / denom if denom != 0 else 0

def dphi2_dx(x, y, y0):
    denom = 2 * np.sqrt(np.abs((1 - x**2)/2))
    return np.sign(y0) * (-x/2) / denom if denom != 0 else 0

def dphi2_dy(x, y, y0): return 0

SYSTEMS = {
    1: {
        "f1": sys_f1, "f2": sys_f2,
        "phi1": sys_phi1, "phi2": sys_phi2,
        "dphi1_dx": dphi1_dx, "dphi1_dy": dphi1_dy,
        "dphi2_dx": dphi2_dx, "dphi2_dy": dphi2_dy,
        "label": "tg(xy + 0.2) = x², x² + 2y² = 1"
    }
}