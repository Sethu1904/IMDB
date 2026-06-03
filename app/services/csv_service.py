import csv
import io
import time
from flask import current_app
from app.models.movie import parse_movie_row


def stream_insert_csv(file_stream, filename: str) -> dict:
    """
    Stream-parse the CSV and bulk-insert in chunks to handle up to 1GB files
    without loading everything into memory.
    """
    db = current_app.db
    collection = db["movies"]
    chunk_size = current_app.config["UPLOAD_CHUNK_SIZE"]

    start = time.time()
    total = 0
    batch = []

    text_stream = io.TextIOWrapper(file_stream, encoding="utf-8", errors="replace")
    reader = csv.DictReader(text_stream)

    for row in reader:
        doc = parse_movie_row(row)
        batch.append(doc)
        if len(batch) >= chunk_size:
            collection.insert_many(batch, ordered=False)
            total += len(batch)
            batch = []

    if batch:
        collection.insert_many(batch, ordered=False)
        total += len(batch)

    elapsed = round(time.time() - start, 2)
    return {"total_records": total, "time_taken": elapsed, "filename": filename}
