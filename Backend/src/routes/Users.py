"""
    This file contains the routes for the users blueprint.
"""

"""--------------imports from route Users---------------------"""

from flask import Blueprint, jsonify, request
from werkzeug.security import  generate_password_hash, check_password_hash
from utils.jwt_functions import *
from utils.database import pool
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
User = Blueprint('User', __name__, url_prefix='/api/users')

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
    conn = pool.get_connection()
    cur = conn.cursor()
    if data['user'] == "" or data['password'] == "" or data['name'] == "":
        return jsonify({"message": "Los datos enviados no son validos o existen campos vacios"}), 401
    else:
        try:
            usr = data['user']
            query = "SELECT * FROM users WHERE user = %s;"
            cur.execute(query, (usr,))
            dbres = cur.fetchall()
            if len(dbres) == 0:
                if re.match(r'^.{1,15}$', usr):
                    if re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{7,16}$', data['password']):
                        name = data['name']
                        password = generate_password_hash(data['password'], method='sha256')
                        query = "INSERT INTO users (user, name, password) VALUES (%s,%s,%s);"
                        cur.execute(query, (usr, name, password))
                        conn.commit()
                        cur.close()
                        conn.close()
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
            print(e)
            data = {"message": "Error en la consulta a la base de datos"}
            return resfunc(data), 500
        finally:
            if cur:
                print("Closing cursor")
                cur.close()
            if conn:
                print("Closing connection")
                conn.close()



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
    conn = pool.get_connection()
    cur = conn.cursor()
    data = request.get_json()
    if data['user'] == "" or data['password'] == "":
        data = {"message": "Los datos enviados no son validos o existen campos vacios"}
        return resfunc(data), 401
    else:
        if re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{7,16}$', data['password']):
            try:
                usr = data['user']
                query = "SELECT * FROM users WHERE user = %s;"
                cur.execute(query, (usr,))
                dbres = cur.fetchall()
                if len(dbres) == 0:
                    cur.close()
                    conn.close()
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
                print(e)
                data = {"message": "Error en la consulta a la base de datos"}
                return resfunc(data), 500
            finally:
                if cur:
                    print("Closing cursor")
                    cur.close()
                if conn:
                    print("Closing connection")
                    conn.close()
        else:
            cur.close()
            conn.close()
            data = {"message": "La contraseña debe tener entre 7 y 16 caracteres, al menos una letra mayuscula, una minuscula, un numero y un caracter especial"}
            return resfunc(data), 401

@User.route('/get-data-user', methods=['GET'])
@verify_token
def getDataUser():
    conn = pool.get_connection()
    cur = conn.cursor()
    try:
        data = request.headers
        userID = decode_token(data['Authorization'][7:], os.getenv("SECRET_KEY"))['userID']
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
        if not user_data:
            data =  {"message": "El usuario no existe"}
            return resfunc(data), 401
        user_dict = {
            "userid": user_data[0],
            "user": user_data[1],
            "name": user_data[2],
            "userImage": user_data[3],
            "description": user_data[4],
            "following": user_data[5],
            "followers": user_data[6]
        }
        return resfunc(user_dict), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()


@User.route('/get-data-user-byId', methods=['POST'])
@verify_token
def getDataUserById():
    conn = pool.get_connection()
    cur = conn.cursor()
    try:
        data = request.get_json()
        userId = data["userId"]
        query = """
            SELECT u.userid, u.user, u.name, u.userImage, u.description,
            (SELECT COUNT(*) FROM follows WHERE followerid = u.userid) AS followed,
            (SELECT COUNT(*) FROM follows WHERE followingid = u.userid) AS followers
            FROM users u
            WHERE u.userid = %s;
            """
        cur.execute(query, (userId,))
        user_data = cur.fetchone()
        if not user_data:
            data = {"message": "El usuario no existe"}
            return resfunc(data), 200
        user_dict = {
            "userid": user_data[0],
            "user": user_data[1],
            "name": user_data[2],
            "userImage": user_data[3],
            "description": user_data[4],
            "following": user_data[5],
            "followers": user_data[6]
        }
        return resfunc(user_dict), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()

@User.route("/search-user/<string:user>", methods=["GET"])
@verify_token
def search_user(user):
    conn = pool.get_connection()
    cur = conn.cursor()
    #get params for pagination
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    #calculate offset for pagination
    offset = (page - 1) * per_page
    try:
        usr = "%"+ user + "%"
        query_num_pages = "SELECT CEIL(COUNT(*) / %s) AS total_paginas FROM users WHERE user LIKE %s;"
        cur.execute(query_num_pages, (per_page, usr))
        num_pages = (cur.fetchone())[0]
        query = """
            SELECT u.userid, u.user, u.name, u.userImage, u.description,
            (SELECT COUNT(*) FROM follows WHERE followerid = u.userid) AS followed,
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
                "following": user[5],
                "followers": user[6]
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
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()

#TODO agregar upload de imagen a cloudinary
@User.route("/update-user", methods=["POST"])
@verify_token
def update_user():
    """_summary_

    Returns:
        _type_: _description_
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                            os.getenv("SECRET_KEY"))['userID']
    try:
        update_user = data["user"]
        update_name = data["name"]
        update_user_image = data["userImage"]
        update_description = data["description"]
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
            return jsonify({"message":"Usuario actualizado"}), 200
        return jsonify({"message":"El usuario ya existe"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()

#ep para dar like a un tweet
@User.route("/like-tweet", methods=["POST"])
@verify_token
def like_tweet():
    """_summary_

    Returns:
        _type_: _description_
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    tweet_id = data["tweetId"]
    try:
        query = "SELECT * FROM likes WHERE userid = %s AND tweetid = %s;"
        cur.execute(query, (user_id, tweet_id))
        like = cur.fetchone()
        if like:
            query = "DELETE FROM likes WHERE userid = %s AND tweetid = %s;"
            cur.execute(query, (user_id, tweet_id))
            conn.commit()
            return jsonify({"liked": True}), 200
        else:
            query = "INSERT INTO likes (userid, tweetid, datetime) VALUES (%s, %s, %s);"
            cur.execute(query, (user_id, tweet_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()
            return jsonify({"liked": False}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()

@User.route("/add-comment-to", methods=["POST"])
@verify_token
def add_comment_to():
    """_summary_

    Returns:
        _type_: _description_
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    tweet_id = data["tweetId"]
    comment = data["comment"]
    try:
        query = "INSERT INTO comments (userid, tweetid, comment, datetime) VALUES (%s, %s, %s, %s);"
        cur.execute(query, (user_id, tweet_id, comment, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        return jsonify({"message":"Comentario agregado"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()


@User.route("/delete-comment", methods=["POST"])
@verify_token
def delete_comment():
    """_summary_

    Returns:
        _type_: _description_
    """
    print(request.get_json())
    conn = pool.get_connection()
    cur = conn.cursor()
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    comment_id = data["commentId"]
    try:
        #verifica que el comentario sea del usuario
        query = "SELECT * FROM comments WHERE userid = %s AND commentid = %s;"
        cur.execute(query, (user_id, comment_id))
        res  = cur.fetchone()
        if res:
            query = "DELETE FROM comments WHERE commentid = %s;"
            cur.execute(query, (comment_id,))
            conn.commit()
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
                return jsonify({"message":"Comentario eliminado"}), 200
            else:
                return jsonify({"message":"No se puede eliminar el comentario"}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()

@User.route("/follow-user", methods=["POST"])
@verify_token
def follow_user():
    """_summary_

    Returns:
        _type_: _description_
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    data = request.get_json()
    user_id = decode_token(request.headers.get("Authorization")[7:],
                        os.getenv("SECRET_KEY"))['userID']
    user_to_follow = data["userToFollow"]
    try:
        query = "SELECT * FROM follows WHERE followerid = %s AND followingid = %s;"
        cur.execute(query, (user_id, user_to_follow))
        follow = cur.fetchone()
        if follow:
            query = "DELETE FROM follows WHERE followerid = %s AND followingid = %s;"
            cur.execute(query, (user_id, user_to_follow))
            conn.commit()
            return jsonify({"following": False}), 200
        else:
            query = "INSERT INTO follows(followerid, followingid, followdate) VALUES (%s, %s, %s);"
            cur.execute(query, (user_id, user_to_follow,
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()
            return jsonify({"following":True}), 200
    except Exception as e:
        print(e)
        conn.close()
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()


@User.route('/check-follow/<int:user_to_check>', methods=['GET'])
@verify_token
def check_follow(user_to_check):
    """Check if the current user follows the specified user.

    Args:
        user_to_check (int): The user ID to check if the current user follows.

    Returns:
        JSON: Result of the check.
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    try:
        # Implement this function to get the current user ID from the token
        current_user_id = decode_token(request.headers.get("Authorization")[7:],
                                       os.getenv("SECRET_KEY"))['userID']

        if current_user_id:
            query = "SELECT * FROM follows WHERE followerid = %s AND followingid = %s;"
            cur.execute(query, (current_user_id, user_to_check))
            follow = cur.fetchone()
            if follow:
                return jsonify({"message": "Ya sigues a este usuario", "follows": True}), 200
            else:
                return jsonify({"message": "No sigues a este usuario", "follows": False}), 200
        else:
            return jsonify({"message": "Error al obtener el ID de usuario actual"}), 401
    except Exception as e:
        print(e)
        return jsonify({"message": "Error en la consulta a la base de datos"}), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()


@User.route('/followers/<int:user_id>', methods=['GET'])
@verify_token
def get_followers(user_id):
    """Get the list of followers for a specific user.

    Args:
        user_id (int): The user ID for which to get the followers.

    Returns:
        JSON: List of followers.
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    try:
        query = "SELECT u.userid, u.user, u.name, u.userImage FROM users u JOIN follows f ON u.userid = f.followerid WHERE f.followingid = %s;"
        cur.execute(query, (user_id,))
        followers = cur.fetchall()
        followers_list = [{
            "userID": follower[0],
            "user": follower[1],
            "name": follower[2],
            "userImage": follower[3],
        } for follower in followers]
        return jsonify({"followers": followers_list}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error en la consulta a la base de datos"}), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()


@User.route('/following/<int:user_id>', methods=['GET'])
@verify_token
def get_following(user_id):
    """Get the list of users that a specific user is following.

    Args:
        user_id (int): The user ID for which to get the following users.

    Returns:
        JSON: List of following users.
    """
    conn = pool.get_connection()
    cur = conn.cursor()
    try:
        query = "SELECT u.userid, u.user, u.name, u.userImage FROM users u JOIN follows f ON u.userid = f.followingid WHERE f.followerid = %s;"
        cur.execute(query, (user_id,))
        following = cur.fetchall()
        following_list = [{
            "userID": followed[0],
            "user": followed[1],
            "name": followed[2],
            "userImage": followed[3],
        } for followed in following]
        return jsonify({"following": following_list}), 200

    except Exception as e:
        print(e)
        return jsonify({"message": "Error en la consulta a la base de datos"}), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()

@User.route("/get-tweets-home", methods=["GET"])
@verify_token
def get_tweets_home():
    user_id = decode_token(request.headers.get("Authorization")[7:],
                           os.getenv("SECRET_KEY"))['userID']
    conn = pool.get_connection()
    cur = conn.cursor()
    try:

        # Parámetros para la paginación
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        offset = (page - 1) * per_page
        query = """
            SELECT
                t.tweetid,
                t.userid,
                t.description AS tweet,
                t.tweetImage,
                t.datetime,
                u.user AS username,
                u.userImage AS userImage,
                u.name AS fullName,
                COUNT(l.likeid) AS likeCount,
                COUNT(c.commentid) AS commentCount
            FROM
                tweets t
            JOIN
                users u ON t.userid = u.userid
            LEFT JOIN
                likes l ON t.tweetid = l.tweetid
            LEFT JOIN
                comments c ON t.tweetid = c.tweetid
            WHERE
                t.userid IN (SELECT followingid FROM follows WHERE followerid = %s)
            GROUP BY
                t.tweetid
            ORDER BY
                t.datetime DESC
            LIMIT %s OFFSET %s;
        """
        cur.execute(query, (user_id, per_page, offset))
        tweets = cur.fetchall()
        tweets_res = []
        for tweet in tweets:
            # "tweetid",
            # "userid",
            # "description",
            # "tweetImage",
            # "datetime"
            tweets_res.append({
                "tweetID": tweet[0],
                "userID": tweet[1],
                "description": tweet[2],
                "tweetImage": tweet[3],
                "datetime": tweet[4]
            })
        return jsonify({"tweets": tweets_res}), 200
    except Exception as e:
        print(e)
        data = {"message": "Error en la consulta a la base de datos"}
        return resfunc(data), 500
    finally:
        if cur:
            print("Closing cursor")
            cur.close()
        if conn:
            print("Closing connection")
            conn.close()