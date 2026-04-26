from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.db import Base


class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    inventory_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    photo_filename = Column(String(255), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )