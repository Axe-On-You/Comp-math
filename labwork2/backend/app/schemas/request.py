from pydantic import BaseModel
from typing import Optional

class EquationRequest(BaseModel):
    equation_id: int
    method: str  # 'chord', 'newton', 'iteration'
    a: float
    b: float
    epsilon: float
    initial_x: Optional[float] = None

class SystemRequest(BaseModel):
    system_id: int
    x0: float
    y0: float
    epsilon: float