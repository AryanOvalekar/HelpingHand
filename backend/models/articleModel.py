import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class articleModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    title: str = Field(...)
    description: str = Field(...)
    url: str = Field(...)
    urlToImage: str = Field(...)
    publishedAt: datetime = Field(...)
    category: str = Field(...)
    severity: bool = True
    location: str = Field(...)
    need: int = -1
    longitude: float = 0
    latitude: float = 0

    class Config:
        validate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "title": "Don Quixote",
                "description": "Miguel de Cervantes",
                "url": "...",
                "urlToImage": "...",
                "location": "NJ",
                "publishedAt": "2025-05-10",
                "seversity": True,
                "need": 3,
                "category": "naturalDisaster",
                "longitude": 9,
                "latitude": 10
            }
        }