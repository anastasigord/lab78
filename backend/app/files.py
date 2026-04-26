import os
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

BASE_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = BASE_DIR / "uploads"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_image_file(upload: UploadFile) -> None:
    if upload.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported image type. Use jpeg, png, webp, or gif.",
        )


def save_image_file(upload: UploadFile) -> str:
    ensure_upload_dir()

    original_ext = Path(upload.filename or "").suffix.lower()
    if not original_ext:
        extension_by_type = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
        }
        original_ext = extension_by_type.get(upload.content_type or "", ".bin")

    stored_name = f"{uuid4().hex}{original_ext}"
    output_path = UPLOAD_DIR / stored_name

    with output_path.open("wb") as destination:
        destination.write(upload.file.read())

    return stored_name


def delete_image_file(filename: str | None) -> None:
    if not filename:
        return

    path = UPLOAD_DIR / filename
    if path.exists() and path.is_file():
        os.remove(path)


def build_photo_url(item_id: int) -> str:
    return f"/inventory/{item_id}/photo"
