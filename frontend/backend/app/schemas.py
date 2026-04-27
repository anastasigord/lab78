from datetime import datetime
from pydantic import BaseModel, Field


class InventoryTextUpdate(BaseModel):
    inventory_name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None


class InventoryRead(BaseModel):
    id: int
    inventory_name: str
    description: str | None
    photo_url: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}