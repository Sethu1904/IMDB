from flask import Blueprint, render_template

views_bp = Blueprint("views", __name__)


@views_bp.route("/")
@views_bp.route("/upload")
def upload_page():
    return render_template("upload.html")


@views_bp.route("/movies")
def movies_page():
    return render_template("movies.html")
