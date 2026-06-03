from flask import Flask
from pymongo import MongoClient
from .config import Config


def create_app():
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(Config)

    client = MongoClient(app.config["MONGO_URI"])
    app.db = client[app.config["MONGO_DB_NAME"]]

    from .routes.movies import movies_bp
    from .routes.upload import upload_bp

    app.register_blueprint(movies_bp, url_prefix="/api")
    app.register_blueprint(upload_bp, url_prefix="/api")

    from .routes.views import views_bp
    app.register_blueprint(views_bp)

    return app
