## Installation
You need Python and [FastAPI](https://fastapi.tiangolo.com/#installation) installed on your computer.

Install dependencies with:
```python
pip install -r requirements.txt
```

## Running

To run the backend do:
```bash
fastapi dev main.py
```

To see Swagger for endpoints go to the localhost:8000/docs

## App.tsx
Manages the tabs and renders components like AddNewEntry, MainTable, GalleryTable, and SearchTable.

## AddNewEntry.tsx
Allows users to add a new entry (including name, origin, and image).
Manages state and handles form submission to create new entries, including handling file uploads.

## MainTable.tsx
Displays each object from entryData with buttons to toggle the visibility of each entry's details.
Renders the EntryTable component when the user clicks the button to show details.

## EntryTable.tsx
Displays details of each entry, including a small image that toggles to full screen on click.

## GalleryTable.tsx
Displays a gallery of images from the entryData.
Handles full-screen image view when a thumbnail is clicked.
Filters out entries without images to avoid showing items with no image.
