from datetime import datetime


def parse_movie_row(row: dict) -> dict:
    """Normalize a CSV row into the MongoDB document shape."""

    def safe_float(val, default=None):
        try:
            return float(val) if val not in (None, "", "nan") else default
        except (ValueError, TypeError):
            return default

    def safe_int(val, default=None):
        try:
            return int(float(val)) if val not in (None, "", "nan") else default
        except (ValueError, TypeError):
            return default

    release_date = None
    release_year = None
    raw_date = row.get("release_date", "")
    if raw_date:
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y"):
            try:
                release_date = datetime.strptime(raw_date.strip(), fmt)
                release_year = release_date.year
                break
            except ValueError:
                continue

    # languages field is stored like "['English', 'Français']"
    raw_langs = row.get("languages", "")
    languages = []
    if raw_langs:
        import ast
        try:
            parsed = ast.literal_eval(raw_langs)
            languages = [l.strip() for l in parsed if isinstance(l, str)]
        except Exception:
            languages = [raw_langs.strip()]

    return {
        "title": row.get("title", "").strip(),
        "original_title": row.get("original_title", "").strip(),
        "original_language": row.get("original_language", "").strip(),
        "languages": languages,
        "overview": row.get("overview", "").strip(),
        "release_date": release_date,
        "release_year": release_year,
        "runtime": safe_int(row.get("runtime")),
        "status": row.get("status", "").strip(),
        "budget": safe_float(row.get("budget")),
        "revenue": safe_float(row.get("revenue")),
        "homepage": row.get("homepage", "").strip(),
        "vote_average": safe_float(row.get("vote_average")),
        "vote_count": safe_int(row.get("vote_count")),
        "production_company_id": safe_int(row.get("production_company_id")),
        "genre_id": safe_int(row.get("genre_id")),
    }
