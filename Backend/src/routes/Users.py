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
from datetime import datetime
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
        #obtener seguidores y seguidos
        query = """
            SELECT u.userid, u.user, u.name, u.userImage, u.description,
            (SELECT COUNT(*) FROM follows WHERE followerid = u.userid) AS followed,
            (SELECT COUNT(*) FROM follows WHERE followingid = u.userid) AS followers
            FROM users u
            WHERE u.userid = %s;
            """
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
            "description": user_data[4],
            "followed": user_data[5],
            "followers": user_data[6]
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
        query = """
            SELECT u.userid, u.user, u.name, u.userImage, u.description,
            (SELECT COUNT(*) FROM follows WHERE followerid = u.userid) AS followed,
            (SELECT COUNT(*) FROM follows WHERE followingid = u.userid) AS followers
            FROM users u
            WHERE u.userid = %s;
            """
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
            "description": user_data[4],
            "followed": user_data[5],
            "followers": user_data[6]
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
        query = """
            SELECT u.userid, u.user, u.name, u.userImage, u.description,
            (SELECT COUNT(*) FROM follows WHERE followingid = u.userid) AS followers
            FROM users u
            WHERE u.user LIKE %s
            LIMIT %s OFFSET %s;
            """
        cur.execute(query, (usr, per_page, offset))
        users = cur.fetchall()
        users_res = []
        if len(users) == 0:
            data = {"message": "User not founf"}
            return resfunc(data), 200

        for user in users:
            users_res.append({
                "userId": user[0],
                "user": user[1],
                "name": user[2],
                "userImage": user[3],
                "description": user[4],
                "followers": user[5]
            })
        data = {
            "totalPages": f"{num_pages}",
            "users": users_res
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

#ep para dar like a un tweet
@User.route("/like-tweet", methods=["POST"])
@verify_token
def like_tweet():
    """_summary_

    Returns:
        _type_: _description_
    """
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    tweet_id = data["tweetId"]
    try:
        cur = conn.cursor()
        query = "SELECT * FROM likes WHERE userid = %s AND tweetid = %s;"
        cur.execute(query, (user_id, tweet_id))
        like = cur.fetchone()
        print(like)
        if like:
            query = "DELETE FROM likes WHERE userid = %s AND tweetid = %s;"
            cur.execute(query, (user_id, tweet_id))
            conn.commit()
            cur.close()
            return jsonify({"message":"Like eliminado"}), 200
        else:
            query = "INSERT INTO likes (userid, tweetid, datetime) VALUES (%s, %s, %s);"
            cur.execute(query, (user_id, tweet_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()
            cur.close()
            return jsonify({"message":"Like agregado"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500

@User.route("/add-comment-to", methods=["POST"])
@verify_token
def add_comment_to():
    """_summary_

    Returns:
        _type_: _description_
    """
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    tweet_id = data["tweetId"]
    comment = data["comment"]
    try:
        cur = conn.cursor()
        query = "INSERT INTO comments (userid, tweetid, comment, datetime) VALUES (%s, %s, %s, %s);"
        cur.execute(query, (user_id, tweet_id, comment, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        cur.close()
        return jsonify({"message":"Comentario agregado"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500

@User.route("/delete-comment", methods=["POST"])
@verify_token
def delete_comment():
    """_summary_

    Returns:
        _type_: _description_
    """
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    comment_id = data["commentId"]
    try:
        cur = conn.cursor()
        #verifica que el comentario sea del usuario
        query = "SELECT * FROM comments WHERE userid = %s AND commentid = %s;"
        cur.execute(query, (user_id, comment_id))
        res  = cur.fetchone()
        if res:
            query = "DELETE FROM comments WHERE commentid = %s;"
            cur.execute(query, (comment_id,))
            conn.commit()
            cur.close()
            return jsonify({"message":"Comentario eliminado"}), 200
        #si el comentario no es del usuario, verifica que el usuario sea el dueño del tweet
        elif not res:
            query = "SELECT * FROM tweets WHERE userid = %s AND tweetid = (SELECT tweetid FROM comments WHERE commentid = %s);"
            cur.execute(query, (user_id, comment_id))
            res = cur.fetchone()
            if res:
                query = "DELETE FROM comments WHERE commentid = %s;"
                cur.execute(query, (comment_id,))
                conn.commit()
                cur.close()
                return jsonify({"message":"Comentario eliminado"}), 200
            else:
                return jsonify({"message":"No se puede eliminar el comentario"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500

@User.route("/follow-user", methods=["POST"])
@verify_token
def follow_user():
    """_summary_

    Returns:
        _type_: _description_
    """
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    user_to_follow = data["userToFollow"]
    try:
        cur = conn.cursor()
        query = "SELECT * FROM follows WHERE followerid = %s AND followingid = %s;"
        cur.execute(query, (user_id, user_to_follow))
        follow = cur.fetchone()
        if follow:
            query = "DELETE FROM follows WHERE followerid = %s AND followingid = %s;"
            cur.execute(query, (user_id, user_to_follow))
            conn.commit()
            cur.close()
            return jsonify({"message":"Dejaste de seguir al usuario"}), 200
        else:
            query = "INSERT INTO follows(followerid, followingid, followdate) VALUES (%s, %s, %s);"
            cur.execute(query, (user_id, user_to_follow,
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()
            cur.close()
            return jsonify({"message":"Ahora sigues al usuario"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500

#TODO agregar ruta par obtener una lista los seguidores de un usuario

#TODO agregar ruta para obtener una lista de los usuarios que sigue un usuario

@User.route("/get-tweets-home", methods=["GET"])
@verify_token
def get_tweets_home():
    """_summary_

    Returns:
        _type_: _description_
    """
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    try:
        cur = conn.cursor()
        query = """
        SELECT tweets.*
        FROM tweets
        JOIN follows ON tweets.userid = follows.followingid
        WHERE follows.followerid = 1;
        """
        cur.execute(query, (user_id,))
        tweets = cur.fetchall()
        cur.close()
        return jsonify({"tweets":tweets}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
