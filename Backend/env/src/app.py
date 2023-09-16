"""
    |----------------------------------------------------|
    | This file contains source code form app class      |
    | here is register all blueprints and error handlers |
    | here is the config from app                        |
    |-------------------By JocznHM-----------------------|
    |----------------------------------------------------|
"""

#---------------imports from app object------------------
from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import BadRequest
#---------------imports from blueprints------------------
from routes.Users import User
#---------------code and config------------------
app = Flask(__name__)

#example of how to register blueprints
app.register_blueprint(User)



@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify({
        "message": "Endpoint Not Found"
    }), 404
