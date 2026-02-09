from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 3

class QueryResponse(BaseModel):
    answer: str
    context: List[str]
    question: str

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_count: int
    job_id: Optional[str] = None
