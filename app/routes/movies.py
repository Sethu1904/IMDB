from flask import Blueprint, request, jsonify, current_app

movies_bp = Blueprint("movies", __name__)

SORT_FIELD_MAP = {
    "release_date": "release_date",
    "rating": "vote_average",
}


@movies_bp.route("/movies", methods=["GET"])
def list_movies():
    db = current_app.db
    collection = db["movies"]

    # --- pagination ---
    try:
        page = max(1, int(request.args.get("page", 1)))
        limit = min(100, max(1, int(request.args.get("limit", 10))))
    except ValueError:
        return jsonify({"error": "Invalid pagination params"}), 400

    # --- filters ---
    query = {}
    year = request.args.get("year")
    if year and year != "all":
        try:
            query["release_year"] = int(year)
        except ValueError:
            return jsonify({"error": "Invalid year"}), 400

    language = request.args.get("language")
    if language and language.lower() != "all":
        query["languages"] = {"$in": [language]}

    # --- sorting ---
    sort_by = request.args.get("sort_by", "release_date")
    order = request.args.get("order", "desc")
    mongo_field = SORT_FIELD_MAP.get(sort_by, "release_date")
    mongo_order = -1 if order == "desc" else 1

    skip = (page - 1) * limit
    total = collection.count_documents(query)

    cursor = (
        collection.find(query, {"_id": 0})
        .sort(mongo_field, mongo_order)
        .skip(skip)
        .limit(limit)
    )

    movies = []
    for doc in cursor:
        doc["release_date"] = (
            doc["release_date"].strftime("%d %b %Y") if doc.get("release_date") else None
        )
        movies.append(doc)

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit,
        "movies": movies,
    }), 200


@movies_bp.route("/movies/filters", methods=["GET"])
def get_filter_options():
    """Return distinct years and languages for filter dropdowns."""
    db = current_app.db
    collection = db["movies"]

    years = sorted(
        [y for y in collection.distinct("release_year") if y is not None],
        reverse=True,
    )
    languages = sorted(
        [l for l in collection.distinct("languages") if l]
    )

    return jsonify({"years": years, "languages": languages}), 200
