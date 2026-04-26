from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.files import ensure_upload_dir
from app.routers.inventory import router as inventory_router

app = FastAPI(title="Inventory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup() -> None:
    ensure_upload_dir()
    Base.metadata.create_all(bind=engine)

@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}

app.include_router(inventory_router)