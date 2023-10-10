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
        return jsonify({"message": "los datos enviados no son validos o existen campos vacios"}), 401
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
                        data = {"message": "la contraseña debe tener entre 7 y 16 caracteres, al menos una letra mayuscula, una minuscula, un numero y un caracter especial"}
                        return resfunc(data), 200
                else:
                    data = {"message": "el usuario debe tener entre 1 y 15 caracteres"}
                    return resfunc(data), 200
            else:
                data = {"message": "el usuario ya existe en la base de datos"}
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
        data = {"message": "los datos enviados no son validos o existen campos vacios"}
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
                    return jsonify({"message": "el usuario no existe"}), 200
                else:
                    for user in dbres:
                        if check_password_hash(user[3], data['password']):
                            payload = {"userID": user[0], "user": user[1]}
                            authtoken = encode_data(
                             payload, os.getenv("SECRET_KEY"))
                            data = {"message": "logged in", "auth_token": f"{authtoken}", "userID": f"{user[0]}"}
                            return resfunc(data), 200
                        else:
                            data = {"message": "la contraseña es incorrecta"}
                            return resfunc(data), 200
            except Exception as e:
                data = {"message": "Error en la consulta a la base de datos"}
                return resfunc(data), 500
        else:
            data = {"message": "la contraseña debe tener entre 7 y 16 caracteres, al menos una letra mayuscula, una minuscula, un numero y un caracter especial"}
            return resfunc(data), 200

#TODO make a route to get user data and another user routes
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
