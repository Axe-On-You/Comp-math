from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Dict

class MethodType(str, Enum):
    LEFT = "left"
    RIGHT = "right"
    MIDDLE = "middle"
    TRAPEZOID = "trapezoid"
    SIMPSON = "simpson"

class IntegrationRequest(BaseModel):
    function_id: int = Field(..., ge=1, le=8)
    method: MethodType
    a: float
    b: float
    epsilon: float = Field(..., gt=0)

class Point(BaseModel):
    x: float
    y: float

class IntegrationResponse(BaseModel):
    result: float
    n: int
    error: float
    graph_points: List[Point]