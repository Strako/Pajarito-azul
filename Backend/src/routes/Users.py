"""
    This file contains the routes for the users blueprint.
"""

"""--------------imports from route Users---------------------"""

from flask import Blueprint, jsonify, request
from werkzeug.security import  generate_password_hash, check_password_hash
from utils.jwt_functions import *
from utils.database import conn
import os
from dotenv import load_dotenv
from utils.middleware import verify_token
import json
import re
import time

# load dotenv to get env vars
load_dotenv()

#register blueprint for users
User = Blueprint('User', __name__, url_prefix='/users')

#-----------------------------------Routes------------------------------------------

@User.route('/sign-up', methods=['POST'])
def signUp():
    """
    This function is the route for the create usrer . Returns a success message.
    description:
        Route for create user.
    parameters:
        user
        name
        passwd
    returns:
        error message||success message
    """
    data = request.get_json()
    if data['user'] == "" or data['password'] == "" or data['name'] == "":
        return jsonify({"message": "los datos enviados no son validos o existen campos vacios"}), 400
    else:
        try:
            usr = data['user']
            cur = conn.cursor()
            query = f"SELECT * FROM users WHERE user = '{usr}';"
            cur.execute(query)
            dbres = cur.fetchall()
            cur.close()
            print(dbres)
            if len(dbres) == 0:
                name = data['name']
                password = generate_password_hash(data['password'], method='sha256')
                cur = conn.cursor()
                query = f"INSERT INTO users (user, name, password) VALUES ('{usr}', '{name}', '{password}');"
                cur.execute(query)
                conn.commit()
                cur.close()
                return jsonify({"message": "Usuario creado exitosamente"}), 200
            else:
                return jsonify({"message": "el usuario ya existe en la base de datos"}), 409
        except Exception as e:
            print(e)
            return jsonify({"message": f"Error en la consulta a la base de datos"}), 500



@User.route('/sign-in', methods=['POST'])
def singIn():
    """
    This function is the route for the sign-in. Returns a JWT token.
    description:
        Route for the sign-in.
    parameters:
        user
        password
    returns:
        JSON
            JWT token to get requests data from another Routes.
    """
    data = request.get_json()
    if data['user'] == "" or data['password'] == "":
        return jsonify({"message": "los datos enviados no son validos o existen campos vacios"}), 400
    else:
        if re.match(r"(.{7})", data['password']):
            try:
                usr = data['user']
                cur = conn.cursor()
                query = f"SELECT * FROM users WHERE user = '{usr}';"
                """
                    This Query returns a tuple with the user data.
                    Format: (id, user, name, password, userImage, description)
                """
                cur.execute(query)
                dbres = cur.fetchall()
                cur.close()
                if len(dbres) == 0:
                    return jsonify({"message": "el usuario no existe"}), 409
                else:
                    for user in dbres:
                        if check_password_hash(user[3], data['password']):
                            user = user[1]
                            id = user[0]
                            payload = {"user": user, "id": id}
                            authtoken = encode_data(
                             payload, os.getenv("SECRET_KEY"))
                            return jsonify({"message": "logged in", "auth_token": f"{authtoken}", "userid": f"{user}"}), 200
                        else:
                            return jsonify({"message": "la contraseña es incorrecta"}), 400
            except Exception as e:
                return jsonify({"message": f"Error en la consulta a la base de datos"}), 500
        else:
            return jsonify({"message": f"La longitud de la contraseña es menor al establecido"}), 400

#TODO make a route to get user data and another user routes
@User.route('/get-data-user', methods=['POST'])
@verify_token
def getDataUser():
    return jsonify({"message": "ok"}), 200

