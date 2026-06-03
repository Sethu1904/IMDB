from flask import Blueprint, request, jsonify, current_app
from app.services.csv_service import stream_insert_csv

upload_bp = Blueprint("upload", __name__)


@upload_bp.route("/upload", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".csv"):
        return jsonify({"error": "Only CSV files are allowed"}), 400

    try:
        result = stream_insert_csv(file.stream, file.filename)
        return jsonify({
            "success": True,
            "filename": result["filename"],
            "total_records": result["total_records"],
            "time_taken": result["time_taken"],
        }), 200
    except Exception as e:
        current_app.logger.error(f"Upload failed: {e}")
        return jsonify({"error": "Failed to process CSV", "detail": str(e)}), 500
