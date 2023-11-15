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
import re
from utils.resfunctions import resfunc

# load dotenv to get env vars
load_dotenv()

magicWord = os.getenv("SECRET_KEY")
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
        return jsonify({"message": "Los datos enviados no son validos o existen campos vacios"}), 401
    else:
        try:
            usr = data['user']
            cur = conn.cursor()
            query = "SELECT * FROM users WHERE user = %s;"
            cur.execute(query, (usr,))
            dbres = cur.fetchall()
            cur.close()
            if len(dbres) == 0:
                if re.match(r'^.{1,15}$', usr):
                    if re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{7,16}$', data['password']):
                        name = data['name']
                        password = generate_password_hash(data['password'], method='sha256')
                        cur = conn.cursor()
                        query = "INSERT INTO users (user, name, password) VALUES (%s,%s,%s);"
                        cur.execute(query, (usr, name, password))
                        conn.commit()
                        cur.close()
                        data = {"message": "Usuario creado exitosamente"}
                        return resfunc(data), 200
                    else:
                        data = {"message": "La contraseña debe tener entre 7 y 16 caracteres, al menos una letra mayuscula, una minuscula, un numero y un caracter especial"}
                        return resfunc(data), 200
                else:
                    data = {"message": "El usuario debe tener entre 1 y 15 caracteres"}
                    return resfunc(data), 200
            else:
                data = {"message": "El usuario ya existe en la base de datos"}
                return resfunc(data), 200
        except Exception as e:
            data = {"message": "Error en la consulta a la base de datos"}
            return resfunc(data), 500



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
        data = {"message": "Los datos enviados no son validos o existen campos vacios"}
        return resfunc(data), 401
    else:
        if re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{7,16}$', data['password']):
            try:
                usr = data['user']
                cur = conn.cursor()
                query = "SELECT * FROM users WHERE user = %s;"
                cur.execute(query, (usr,))
                dbres = cur.fetchall()
                cur.close()
                if len(dbres) == 0:
                    return jsonify({"message": "El usuario no existe"}), 401
                else:
                    for user in dbres:
                        if check_password_hash(user[3], data['password']):
                            payload = {"userID": user[0], "user": user[1]}
                            authtoken = encode_data(
                             payload, os.getenv("SECRET_KEY"))
                            data = {"message": "Logged in", "auth_token": f"{authtoken}", "userID": f"{user[0]}"}
                            return resfunc(data), 200
                        else:
                            data = {"message": "la contraseña es incorrecta"}
                            return resfunc(data), 401
            except Exception as e:
                data = {"message": "Error en la consulta a la base de datos"}
                return resfunc(data), 500
        else:
            data = {"message": "La contraseña debe tener entre 7 y 16 caracteres, al menos una letra mayuscula, una minuscula, un numero y un caracter especial"}
            return resfunc(data), 401

@User.route('/get-data-user', methods=['GET'])
@verify_token
def getDataUser():
    try:
        data = request.headers
        userID = decode_token(data['Authorization'][7:], os.getenv("SECRET_KEY"))['userID']
        cur = conn.cursor()
        query = "SELECT userid, user, name, userImage, description FROM users WHERE userid = %s;"
        cur.execute(query, (userID,))
        user_data = cur.fetchone()
        cur.close()
        if not user_data:
            data =  {"message": "El usuario no existe"}
            return resfunc(data), 401
        user_dict = {
            "userid": user_data[0],
            "user": user_data[1],
            "name": user_data[2],
            "userImage": user_data[3],
            "description": user_data[4]
        }
        return resfunc(user_dict), 200
    except Exception as e:
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500


@User.route('/get-data-user-byId', methods=['POST'])
@verify_token
def getDataUserById():
    try:
        data = request.get_json()
        userId = data["userId"]
        cur = conn.cursor()
        query = "SELECT userid, user, name, userImage, description FROM users WHERE userid = %s;"
        cur.execute(query, (userId,))
        user_data = cur.fetchone()
        cur.close()
        if not user_data:
            data = {"message": "El usuario no existe"}
            return resfunc(data), 200
        user_dict = {
            "userid": user_data[0],
            "user": user_data[1],
            "name": user_data[2],
            "userImage": user_data[3],
            "description": user_data[4]
        }
        return resfunc(user_dict), 200
    except Exception as e:
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500

@User.route("/search-user/<string:user>", methods=["GET"])
@verify_token
def search_user(user):
    #get params for pagination
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    #calculate offset for pagination
    offset = (page - 1) * per_page
    try:
        usr = "%"+ user + "%"
        cur = conn.cursor()
        query_num_pages = "SELECT CEIL(COUNT(*) / %s) AS total_paginas FROM users WHERE user LIKE %s;"
        cur.execute(query_num_pages, (per_page, usr))
        num_pages = (cur.fetchone())[0]
        query = "SELECT * FROM users WHERE user LIKE %s LIMIT %s OFFSET %s;"
        cur.execute(query, (usr, per_page, offset))
        users = cur.fetchall()
        users_res = []
        if len(users) == 0:
            data = {"message": "Usuario no encontrado"}
            return resfunc(data), 200

        for user in users:
            users_res.append({
                "user_id": user[0],
                "user": user[1],
                "name": user[2],
                "userImage": user[4],
                "description": user[5]
            })
        data = {
            "total_paginas": f"{num_pages}",
            "usuarios": users_res
        }
        return resfunc(data), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500

@User.route("/update-user", methods=["POST"])
@verify_token
def update_user():
    """_summary_

    Returns:
        _type_: _description_
    """
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                           os.getenv("SECRET_KEY"))['userID']
    try:
        update_user = data["user"]
        update_name = data["name"]
        update_user_image = data["userImage"]
        update_description = data["description"]
        cur = conn.cursor()
        query_user = "SELECT * FROM users WHERE userid = %s;"
        cur.execute(query_user, (user_id,))
        user = cur.fetchone()
        if update_user != user[1]:
            if update_user == "":
                update_user = user[1]
            if update_name == "":
                update_name = user[2]
            if update_user_image == "":
                update_user_image = user[4]
            if update_description == "":
                update_description = user[5]
            query_update = "UPDATE users SET user = %s, name = %s, userImage = %s, description = %s WHERE userid = %s;"
            cur.execute(query_update, (update_user, update_name, update_user_image, update_description, user_id))
            conn.commit()
            cur.close()
            return jsonify({"message":"Usuario actualizado"}), 200
        return jsonify({"message":"El usuario ya existe"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
