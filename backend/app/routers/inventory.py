from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app import crud, schemas
from app.db import get_db
from app.files import (
    UPLOAD_DIR,
    build_photo_url,
    delete_image_file,
    save_image_file,
    validate_image_file,
)

router = APIRouter(tags=["inventory"])

def to_inventory_read(item) -> schemas.InventoryRead:
    return schemas.InventoryRead(
        id=item.id,
        inventory_name=item.inventory_name,
        description=item.description,
        photo_url=build_photo_url(item.id) if item.photo_filename else None,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )

@router.get("/inventory", response_model=list[schemas.InventoryRead])
def get_inventory(db: Session = Depends(get_db)) -> list[schemas.InventoryRead]:
    items = crud.list_inventory(db)
    return [to_inventory_read(item) for item in items]

@router.post("/register", response_model=schemas.InventoryRead, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    inventory_name: str = Form(..., min_length=1, max_length=255),
    description: str | None = Form(default=None),
    photo: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
) -> schemas.InventoryRead:
    cleaned_name = inventory_name.strip()
    if not cleaned_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="inventory_name is required",
        )

    photo_filename: str | None = None
    if photo is not None:
        validate_image_file(photo)
        photo_filename = save_image_file(photo)

    item = crud.create_inventory(db, cleaned_name, description, photo_filename)
    return to_inventory_read(item)

@router.get("/inventory/{item_id}", response_model=schemas.InventoryRead)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)) -> schemas.InventoryRead:
    item = crud.get_inventory_by_id(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return to_inventory_read(item)

@router.put("/inventory/{item_id}", response_model=schemas.InventoryRead)
def update_inventory_item_text(
    item_id: int,
    payload: schemas.InventoryTextUpdate,
    db: Session = Depends(get_db),
) -> schemas.InventoryRead:
    item = crud.get_inventory_by_id(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    if payload.inventory_name is None and payload.description is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one field (inventory_name or description) must be provided",
        )

    name_to_set = payload.inventory_name.strip() if payload.inventory_name is not None else None
    if payload.inventory_name is not None and not name_to_set:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="inventory_name cannot be empty",
        )

    updated = crud.update_inventory_text(
        db,
        item,
        inventory_name=name_to_set,
        description=payload.description,
    )
    return to_inventory_read(updated)

@router.put("/inventory/{item_id}/photo", response_model=schemas.InventoryRead)
def update_inventory_item_photo(
    item_id: int,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> schemas.InventoryRead:
    item = crud.get_inventory_by_id(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    validate_image_file(photo)
    old_photo = item.photo_filename
    new_photo = save_image_file(photo)
    updated = crud.update_inventory_photo(db, item, new_photo)
    delete_image_file(old_photo)
    return to_inventory_read(updated)

@router.delete("/inventory/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)) -> Response:
    item = crud.get_inventory_by_id(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    photo_filename = item.photo_filename
    crud.delete_inventory(db, item)
    delete_image_file(photo_filename)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/inventory/{item_id}/photo")
def get_inventory_photo(item_id: int, db: Session = Depends(get_db)) -> FileResponse:
    item = crud.get_inventory_by_id(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if not item.photo_filename:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")

    photo_path = UPLOAD_DIR / item.photo_filename
    if not photo_path.exists() or not photo_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo file missing")

    return FileResponse(path=photo_path)