"""
    This file contains the middleware for the routes.
    This middleware is used to validate the JWT token that is sent in the header of the request.
"""
import jwt
from utils.jwt_functions import *
from flask import request, jsonify
from functools import wraps
import os
from dotenv import load_dotenv
from utils.database import conn

load_dotenv()
magicWord = os.getenv("SECRET_KEY")


def verify_token(f):
    """
    This function is used to validate the JWT token sent in the header of the request.
    description:
        This function is used to validate the JWT token sent in the request header.
        Looks for the token in the request header and validates it.
        validation consists of checking if the token contains valid user data.
    parameters:
        None
    returns:
        valid user data
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({"message": "auth token missing"}), 409

        # aqui se valida el token si es que existe
        try:
            print(
                "------------------llamada a verificación de Token------------------------")
            print(f"el token es: {token}")
            data = decode_token(token, magicWord)
            print(f"la data contenida en el token es: {data}")
            print(
                "-------------------------------------------------------------------------")
            if not data:
                return jsonify({"message": "invalid token"}), 409
            else:
                cur = conn.cursor()
                query = f"select* from users where user = '{data['user']}';"
                cur.execute(query)
                resdb = cur.fetchall()
                if resdb == []:
                    return jsonify({"message": "invalid token"}), 409
                else:
                    return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"message": f"BackEnd Error: {e}"}), 409
    return decorated
