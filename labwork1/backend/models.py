from pydantic import BaseModel, Field, field_validator
from typing import List

class SLAERequest(BaseModel):
    # Ограничение размерности: от 1 до 20
    n: int = Field(..., ge=1, le=20, description="Размерность матрицы (n <= 20)")
    matrix_a: List[List[float]] = Field(..., description="Матрица коэффициентов A")
    vector_b: List[float] = Field(..., description="Вектор свободных членов B")

    @field_validator('matrix_a')
    def check_matrix_dimensions(cls, v, info):
        n = info.data.get('n')
        if n is not None:
            if len(v) != n:
                raise ValueError(f"Количество строк матрицы должно быть равно {n}")
            for row in v:
                if len(row) != n:
                    raise ValueError(f"Количество столбцов в каждой строке должно быть равно {n}")
        return v

    @field_validator('vector_b')
    def check_vector_dimensions(cls, v, info):
        n = info.data.get('n')
        if n is not None and len(v) != n:
            raise ValueError(f"Размер вектора B должен быть равен {n}")
        return v