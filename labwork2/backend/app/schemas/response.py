from pydantic import BaseModel
from typing import List, Optional

class IterationStep(BaseModel):
    k: int
    x: float
    f_x: float
    delta: float

class EquationResponse(BaseModel):
    success: bool
    result: Optional[float] = None
    iterations: int
    steps: List[IterationStep]
    error: Optional[str] = None

class SystemStep(BaseModel):
    k: int
    x: float
    y: float
    delta_x: float
    delta_y: float

class SystemResponse(BaseModel):
    success: bool
    x: Optional[float] = None
    y: Optional[float] = None
    iterations: int
    steps: List[SystemStep]
    error: Optional[str] = None