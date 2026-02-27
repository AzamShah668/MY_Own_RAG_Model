from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.1-8b-instant"
    chroma_db_path: str = "./data/chroma_db"
    collection_name: str = "rag_collection"

    model_config = SettingsConfigDict(
        env_file=".env", 
        extra="allow",
        arbitrary_types_allowed=True
    )

settings = Settings()
