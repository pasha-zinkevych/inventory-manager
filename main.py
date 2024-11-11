from fastapi import FastAPI, HTTPException, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional
from PIL import Image
import sqlite3
import math
import json
import os
import qrcode

PAGE_SIZE = 10
app = FastAPI()

# Database setup
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS entries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        picture_path TEXT,
                        custom_data TEXT
                     )''')
    conn.commit()
    conn.close()

def init_static():
    if not os.path.exists("./static"):
        os.mkdir("./static")
    if not os.path.exists("./static/images"):
        os.mkdir("./static/images")

# Pydantic model for incoming entry data
class Entry(BaseModel):
    name: str
    custom_data: Optional[dict] = {}

# Add new entry
@app.post("/entry")
async def add_entry_api(name: str, file: UploadFile = File(...), custom_data: dict = {}):
    # Save image
    img_path = f"static/images/{name}.png"
    with open(img_path, "wb") as image_file:
        content = await file.read()
        image_file.write(content)

    # Generate QR code for the entry
    qr_data = f"http://localhost:8000/entry/{name}"
    qr = qrcode.make(qr_data)
    qr_img = qr.resize((100, 100))

    # Overlay QR code on the image
    with Image.open(img_path) as base_img:
        base_img.paste(qr_img, (10, 10))  # Place QR at top left corner
        base_img.save(img_path)

    # Insert entry in DB
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO entries (name, picture_path, custom_data) VALUES (?, ?, ?)",
                   (name, img_path, json.dumps(custom_data)))
    conn.commit()
    entry_id = cursor.lastrowid
    conn.close()
    return {"id": entry_id, "name": name}

# Get specific entry
@app.get("/entry/{entry_id}")
async def get_entry_api(entry_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, picture_path, custom_data FROM entries WHERE id = ?", (entry_id,))
    entry = cursor.fetchone()
    conn.close()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"id": entry[0], "name": entry[1], "picture_path": entry[2], "custom_data": json.loads(entry[3])}

# List all entries
@app.get("/entries")
async def list_entries_api():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, custom_data FROM entries")
    entries = cursor.fetchall()
    conn.close()
    return [{"id": e[0], "name": e[1], "custom_data": json.loads(e[2])} for e in entries]

# Delete an entry
@app.delete("/entry/{entry_id}")
async def delete_entry_api(entry_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return {"message": "Entry deleted"}

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/entries", response_class=HTMLResponse)
async def list_entries(request: Request, page: int = 1):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM entries")
    total_entries = cursor.fetchone()[0]
    total_pages = math.ceil(total_entries / PAGE_SIZE)
    offset = (page - 1) * PAGE_SIZE

    cursor.execute("SELECT id, name, picture_path, custom_data FROM entries LIMIT ? OFFSET ?", (PAGE_SIZE, offset))
    entries = cursor.fetchall()
    conn.close()
    entries_data = [
        {"id": e[0], "name": e[1], "picture_path": e[2], "custom_data": json.loads(e[3])} for e in entries
    ]
    return {"entries": entries_data, "page": page, "total_pages": total_pages}


if __name__ == "__main__":
    init_db()
    init_static()

    templates = Jinja2Templates(directory="templates")
    app.mount("/static", StaticFiles(directory="static"), name="static")
