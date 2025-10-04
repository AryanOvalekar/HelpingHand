import uuid
from pydantic import BaseModel, Field

class articleModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    title: str = Field(...)
    description: str = Field(...)
    link: str = Field(...)
    location: str = Field(...)
    longitude: int = 0
    latitude: int = 0

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