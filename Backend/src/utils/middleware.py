"""
    This file contains the middleware for the routes.
    This middleware is used to validate the JWT token that is sent in the header of the request.
"""
from utils.jwt_functions import *
from flask import request, jsonify
from functools import wraps
import os
from dotenv import load_dotenv
from utils.database import conn
from utils.resfunctions import resfunc

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
            res = {"message": "auth token missing"}
            return resfunc(res), 401
        # aqui se valida el token si es que existe
        try:
            data = decode_token(token, magicWord)
            if not data:
                res = {"message": "invalid token"}
                return resfunc(res), 401
            else:
                cur = conn.cursor()
                query = "SELECT * FROM users WHERE user = %s;"
                cur.execute(query, (data['user'],))
                resdb = cur.fetchall()
                if resdb == []:
                    res == {"message": "invalid token"}
                    return resfunc(res), 401
                else:
                    return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            res = {"message": "token has expired"}
            return resfunc(res), 401
        except jwt.InvalidTokenError:
            res = {"message": "invalid token"}
            return resfunc(res), 401
        except Exception as e:
            res = {"message": f"BackEnd Error: {e}"}
            return resfunc(res), 500
    return decorated
