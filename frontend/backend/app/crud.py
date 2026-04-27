from sqlalchemy.orm import Session
from app import models

def list_inventory(db: Session) -> list[models.InventoryItem]:
    return db.query(models.InventoryItem).order_by(models.InventoryItem.id.desc()).all()

def get_inventory_by_id(db: Session, item_id: int) -> models.InventoryItem | None:
    return db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()

def create_inventory(
    db: Session,
    inventory_name: str,
    description: str | None,
    photo_filename: str | None,
) -> models.InventoryItem:
    item = models.InventoryItem(
        inventory_name=inventory_name,
        description=description,
        photo_filename=photo_filename,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def update_inventory_text(
    db: Session,
    item: models.InventoryItem,
    inventory_name: str | None,
    description: str | None,
) -> models.InventoryItem:
    if inventory_name is not None:
        item.inventory_name = inventory_name

    if description is not None:
        item.description = description

    db.commit()
    db.refresh(item)
    return item

def update_inventory_photo(
    db: Session,
    item: models.InventoryItem,
    photo_filename: str,
) -> models.InventoryItem:
    item.photo_filename = photo_filename
    db.commit()
    db.refresh(item)
    return item

def delete_inventory(db: Session, item: models.InventoryItem) -> None:
    db.delete(item)
    db.commit()