import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class articleModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    title: str = Field(...)
    description: str = Field(...)
    link: str = Field(...)
    location: str = Field(...)
    date: datetime = Field(...)
    needClothes: bool = False
    needFood: bool = False
    needManpower: bool = False
    needFunding: bool = False
    longitude: float = 0
    latitude: float = 0

    class Config:
        validate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "title": "Don Quixote",
                "description": "Miguel de Cervantes",
                "link": "...",
                "location": "NJ",
                "longitude": 9,
                "latitude": 10
            }
        }