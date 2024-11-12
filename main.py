from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional, List
from PIL import Image
import sqlite3
import math
import json
import os
import qrcode

PAGE_SIZE = 10
IMAGES_FOLDER = "static/images"

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Database setup
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS entries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        image_paths TEXT NOT NULL,
                        reason TEXT NOT NULL,
                        custom_data TEXT
                     )''')
    conn.commit()
    conn.close()

init_db()

def init_static():
    os.makedirs(IMAGES_FOLDER, exist_ok=True)

init_static()

# Pydantic model for incoming entry data
class Entry(BaseModel):
    name: str
    image_paths: str
    reason: str
    custom_data: Optional[dict] = {}

# Add new entry
@app.post("/api/entry")
async def add_entry_api(name: str = Form(...),
                        reason: str = Form(...),
                        images: List[UploadFile] = File(...),
                        custom_data_keys: List[str] = Form([]),
                        custom_data_values: List[str] = Form([])):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    custom_data = {key: value for key, value in zip(custom_data_keys, custom_data_values)}

    # Save images
    image_paths = []
    os.makedirs(os.path.join(IMAGES_FOLDER, name), exist_ok=True)
    for file in images:
        file_path = os.path.join(IMAGES_FOLDER, name, file.filename)
        with open(file_path, "wb") as buff:
            buff.write(await file.read())
        image_paths.append(file_path)

    # Insert entry in DB
    cursor.execute("INSERT INTO entries (name, image_paths, reason, custom_data) VALUES (?, ?, ?, ?)",
                   (name, json.dumps(image_paths), reason, json.dumps(custom_data)))
    conn.commit()
    entry_id = cursor.lastrowid
    conn.close()
    return {"id": entry_id, "name": name}

# Get specific entry
@app.get("/api/entry/{entry_id}")
async def get_entry_api(entry_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, reason, image_paths, custom_data FROM entries WHERE id = ?", (entry_id,))
    entry = cursor.fetchone()
    conn.close()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"id": entry[0], "name": entry[1], "reason": entry[2], "image_paths": json.loads(entry[3]), "custom_data": json.loads(entry[4])}

# List all entries
@app.get("/api/entries")
async def list_entries_api(page: int = 1):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM entries")
    total_entries = cursor.fetchone()[0]
    total_pages = math.ceil(total_entries / PAGE_SIZE)
    offset = (page - 1) * PAGE_SIZE

    cursor.execute("SELECT id, name, reason, image_paths, custom_data FROM entries LIMIT ? OFFSET ?", (PAGE_SIZE, offset))
    entries = cursor.fetchall()
    conn.close()

    entries_data = []
    for entry in entries:
        # Generate QR code for the entry
        qr_data = f"{entry[0]}"
        qr = qrcode.make(qr_data)
        qr_img = qr.resize((100, 100))

        # Overlay QR code on the image
        imgs = []
        for img_path in json.loads(entry[3]):
            with Image.open(img_path) as base_img:
                base_img.paste(qr_img, (10, 10))  # Place QR at top left corner
                imgs.append(base_img)
        data = {"id": entry[0], "name": entry[1], "reason": entry[2], "image_paths": imgs, "custom_data": json.loads(entry[4])}
        entries_data.append(data)

    return {"entries": entries_data, "page": page, "total_pages": total_pages}

# Delete an entry
@app.delete("/api/entry/{entry_id}")
async def delete_entry_api(entry_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return {"id": entry_id, "message": "Entry deleted"}

# Get metainfo, such as entries per page, etc
@app.get("/api/meta")
async def meta():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM entries")
    total_entries = cursor.fetchone()[0]

    return {"entries_per_page": PAGE_SIZE, "entries_count": total_entries}
