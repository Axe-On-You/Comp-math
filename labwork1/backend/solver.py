import numpy as np

class GaussSolver:
    def __init__(self, matrix_a, vector_b):
        self.a = np.array(matrix_a, dtype=float)
        self.b = np.array(vector_b, dtype=float)
        self.n = len(vector_b)
        self.swaps = 0
        
    def solve(self):
        # 1. Прямой ход
        for i in range(self.n):
            if abs(self.a[i][i]) < 1e-12:
                pivot_found = False
                for k in range(i + 1, self.n):
                    if abs(self.a[k][i]) > 1e-12:
                        self.a[[i, k]] = self.a[[k, i]]
                        self.b[[i, k]] = self.b[[k, i]]
                        self.swaps += 1
                        pivot_found = True
                        break
                if not pivot_found:
                    raise ValueError("Матрица вырожденная или имеет бесконечное множество решений.")

            for k in range(i + 1, self.n):
                c = self.a[k][i] / self.a[i][i]
                self.a[k, i:] = self.a[k, i:] - c * self.a[i, i:]
                self.b[k] = self.b[k] - c * self.b[i]

        triangular_res = np.column_stack((self.a, self.b)).tolist()

        det = np.prod(np.diag(self.a)) * ((-1) ** self.swaps)

        # 2. Обратный ход
        x = np.zeros(self.n)
        for i in range(self.n - 1, -1, -1):
            s = np.dot(self.a[i, i + 1:], x[i + 1:])
            x[i] = (self.b[i] - s) / self.a[i][i]

        return {
            "triangular_matrix": triangular_res,
            "solution": x.tolist(),
            "determinant": float(det)
        }

    def get_residuals(self, x_solution, original_a, original_b):
        """Вычисление вектора невязок r = Ax - b"""
        a = np.array(original_a)
        b = np.array(original_b)
        x = np.array(x_solution)
        # r_i = sum(a_ij * x_j) - b_i
        residuals = np.dot(a, x) - b
        return residuals.tolist()