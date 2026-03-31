import numpy as np

# --- Одиночные уравнения ---

def f1(x): return x**3 - 1.89*x**2 - 2*x + 1.76
def df1(x): return 3*x**2 - 3.78*x - 2
def phi1(x, lambda_val): return x + lambda_val * f1(x)

def f2(x): return x**3 + 4.81*x**2 - 17.37*x + 5.38
def df2(x): return 3*x**2 + 9.62*x - 17.37
def phi2(x, lambda_val): return x + lambda_val * f2(x)

EQUATIONS = {
    1: {"f": f1, "df": df1, "phi": phi1, "label": "x³ - 1.89x² - 2x + 1.76 = 0"},
    2: {"f": f2, "df": df2, "phi": phi2, "label": "x³ + 4.81x² - 17.37x + 5.38 = 0"}
}

# --- Системы уравнений ---

def sys_f1(x, y): return np.tan(x * y + 0.2) - x**2
def sys_f2(x, y): return x**2 + 2 * y**2 - 1

# Для МПИ системы: x = sqrt(tan(xy + 0.2)), y = sqrt((1 - x^2)/2)
# Нужно быть аккуратным с областями определения при выборе знаков
def sys_phi1(x, y): 
    val = np.tan(x * y + 0.2)
    return np.sqrt(val) if val >= 0 else 0

def sys_phi2(x, y):
    val = (1 - x**2) / 2
    return np.sqrt(val) if val >= 0 else 0

SYSTEMS = {
    1: {
        "f1": sys_f1, "f2": sys_f2,
        "phi1": sys_phi1, "phi2": sys_phi2,
        "label": "tg(xy + 0.2) = x², x² + 2y² = 1"
    }
}