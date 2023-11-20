"""
    This file contains all routes for the tweets blueprint.
"""

"""---------------------imports from Tweets blueprint---------------------"""

from flask import Blueprint, jsonify, request, Response
from werkzeug.security import generate_password_hash, check_password_hash
from utils.jwt_functions import *
from utils.database import conn
import os
from dotenv import load_dotenv
from utils.middleware import verify_token
import re
import datetime
import json
from utils.resfunctions import resfunc
#load dotenv to get env vars
load_dotenv()
#get magic word from .env
magicWord = os.getenv("SECRET_KEY")

#register blueprint for tweets
Tweet = Blueprint('Tweet', __name__, url_prefix='/tweets')


#-----------------------------------Routes------------------------------------------

@Tweet.route('/create', methods=['POST'])
@verify_token
def createTweet():
    data = request.headers
    userID = decode_token(data['Authorization'][7:], os.getenv("SECRET_KEY"))['userID']
    # Obtener datos del tweet del cuerpo JSON de la solicitud
    tweet_data = request.get_json()
    tweet_desc = tweet_data.get('tweetDesc', '')
    tweet_image = tweet_data.get('tweetImage', '')
    # Obtener la fecha y hora actual
    current_datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        cur = conn.cursor()
        query = """
                INSERT INTO tweets (userid, description, tweetImage, datetime)
                VALUES (%s, %s, %s, %s);
            """
        cur.execute(query, (userID, tweet_desc, tweet_image, current_datetime))
        conn.commit()
        cur.close()
        data = {"message": "Tweet creado exitosamente"}
        return resfunc(data), 200
    except Exception as e:
        data = {"message": "Error al conectarse a la base de datos"}
        return resfunc(data), 500

@Tweet.route('/get-all-tweets', methods=['GET'])
@verify_token
def getAll():
    data = request.headers
    userID = decode_token(data['Authorization'][7:],
                          os.getenv("SECRET_KEY"))['userID']
    try:
        cur = conn.cursor()

        # Obtener los parámetros de consulta para la paginación
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        # Calcular el desplazamiento para la paginación
        offset = (page - 1) * per_page

        queryNoPages = "SELECT CEIL(COUNT(*) / %s) AS total_paginas FROM tweets where userid=%s;"
        cur.execute(queryNoPages, (per_page, userID))
        totalPages = cur.fetchall()[0][0]

        finalQuery = """
            SELECT
                t.*,
                COALESCE(l.num_likes, 0) AS cantidad_likes,
                COALESCE(c.num_comentarios, 0) AS cantidad_comentarios
            FROM
                tweets t
                LEFT JOIN (
                    SELECT tweetid, COUNT(likeid) AS num_likes
                    FROM likes
                    GROUP BY tweetid
                ) l ON t.tweetid = l.tweetid
                LEFT JOIN (
                    SELECT tweetid, COUNT(commentid) AS num_comentarios
                    FROM comments
                    GROUP BY tweetid
                ) c ON t.tweetid = c.tweetid
            WHERE
                t.userid = %s
            GROUP BY
                t.tweetid, t.userid, t.description, t.tweetImage, t.datetime
            ORDER BY
                t.datetime DESC
            LIMIT %s OFFSET %s;
            """
        cur.execute(finalQuery, (userID, per_page, offset))
        dbres = cur.fetchall()
        cur.close()
        print(dbres)
        data_json = {}
        for tweet in dbres:
            data_json[
                tweet[0]] = {
                "tweetID": tweet[0],
                "userID": tweet[1],
                "description": tweet[2],
                "tweetImage": tweet[3],
                "datetime": tweet[4],
                "likes": tweet[5],
                "comments": tweet[6]
            }
        data = {"totalPages":f'{totalPages}', "tweets":data_json}
        return resfunc(data), 200
    except Exception as e:
        data = {"message": "Error al conectarse a la base de datos"}
        return resfunc(data), 500

@Tweet.route('/get-tweets-of/<string:user>', methods=['GET'])
@verify_token
def getTweetsOf(user):
    #get params for pagination
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    #calculate offset for pagination
    offset = (page - 1) * per_page
    try:
        cur = conn.cursor()
        queryNoPages = "SELECT CEIL(COUNT(*) / %s) AS total_paginas FROM tweets where userid=(select userid from users where user=%s);"
        cur.execute(queryNoPages, (per_page, user))
        totalPages = cur.fetchall()[0][0]
        finalQuery = """
            SELECT
                t.*,
                COALESCE(l.num_likes, 0) AS cantidad_likes,
                COALESCE(c.num_comentarios, 0) AS cantidad_comentarios
            FROM
                tweets t
                LEFT JOIN (
                    SELECT tweetid, COUNT(likeid) AS num_likes
                    FROM likes
                    GROUP BY tweetid
                ) l ON t.tweetid = l.tweetid
                LEFT JOIN (
                    SELECT tweetid, COUNT(commentid) AS num_comentarios
                    FROM comments
                    GROUP BY tweetid
                ) c ON t.tweetid = c.tweetid
                LEFT JOIN users u ON t.userid = u.userid
            WHERE
                u.user = %s
            GROUP BY
                t.tweetid, t.userid, t.description, t.tweetImage, t.datetime
            ORDER BY
                t.datetime DESC
            LIMIT %s OFFSET %s;
            """
        cur.execute(finalQuery, (user, per_page, offset))
        dbres = cur.fetchall()
        cur.close()
        data_json = {}
        if len(dbres) == 0:
            msg = {"message":"No se encontraron tweets"}
            return resfunc(msg), 401
        else:
            for tweet in dbres:
                data_json[
                    tweet[0]] = {
                    "tweetID": tweet[0],
                    "userID": tweet[1],
                    "description": tweet[2],
                    "tweetImage": tweet[3],
                    "datetime": tweet[4],
                    "likes": tweet[5],
                    "comments": tweet[6]
                }
            data = {"totalPages":f'{totalPages}', "tweets": data_json}
            return resfunc(data), 200
    except Exception as e:
        print (e)
        data = {"message": "Error al conectarse a la base de datos", "err": f"{e}"}
        return resfunc(data), 500

@Tweet.route('/get-tweet/<int:tweet_id>', methods=['GET'])
@verify_token
def getOne(tweet_id):
    try:
        cur = conn.cursor()
        finalQuery = """
            SELECT
                t.*,
                COALESCE(l.num_likes, 0) AS cantidad_likes,
                COALESCE(c.num_comentarios, 0) AS cantidad_comentarios
            FROM
                tweets t
                LEFT JOIN (
                    SELECT tweetid, COUNT(likeid) AS num_likes
                    FROM likes
                    GROUP BY tweetid
                ) l ON t.tweetid = l.tweetid
                LEFT JOIN (
                    SELECT tweetid, COUNT(commentid) AS num_comentarios
                    FROM comments
                    GROUP BY tweetid
                ) c ON t.tweetid = c.tweetid
            WHERE
                t.tweetid = %s;
        """
        cur.execute(finalQuery, (tweet_id,))
        dbres = cur.fetchall()
        cur.close()

        if len(dbres) == 0:
            data = {"message": "Tweet no encontrado"}
            return resfunc(data), 200

        data = {
            "tweetID": dbres[0][0],
            "userID": dbres[0][1],
            "description": dbres[0][2],
            "tweetImage": dbres[0][3],
            "datetime": dbres[0][4],
            "likes": dbres[0][5],
            "comments": dbres[0][6]
        }
        return resfunc(data), 200
    except Exception as e:
        print(e)
        data = {"message": "Error al conectarse a la base de datos"}
        return resfunc(data), 500



# Ruta para actualizar un tweet
@Tweet.route('/update-tweet/<int:tweet_id>', methods=['PUT'])
@verify_token
def updateTweet(tweet_id):
    try:
        # Obtener el usuario autenticado desde el token
        data = request.headers
        userID = decode_token(data['Authorization']
                              [7:], os.getenv("SECRET_KEY"))['userID']

        # Obtener datos del tweet del cuerpo JSON de la solicitud
        tweet_data = request.get_json()
        tweet_desc = tweet_data.get('tweetDesc', '')
        tweet_image = tweet_data.get('tweetImage', '')

        # Actualizar el tweet en la base de datos si pertenece al usuario autenticado
        cur = conn.cursor()
        query = """
            UPDATE tweets
            SET description = %s, tweetImage = %s
            WHERE tweetid = %s AND userid = %s;
        """
        cur.execute(query, (tweet_desc, tweet_image, tweet_id, userID))
        conn.commit()
        cur.close()

        if cur.rowcount == 1:
            data = {"message": "Tweet actualizado exitosamente"}
            return resfunc(data), 200
        else:
            data = {
                "message": "No se encontró el tweet o no tienes permiso para actualizarlo"}
            return resfunc(data), 200
    except Exception as e:
        data = {"message": "Error al conectarse a la base de datos"}
        return resfunc(data), 500

# Ruta para eliminar un tweet


@Tweet.route('/delete-tweet/<int:tweet_id>', methods=['DELETE'])
@verify_token
def deleteTweet(tweet_id):
    try:
        # Obtener el usuario autenticado desde el token
        data = request.headers
        userID = decode_token(data['Authorization']
                              [7:], os.getenv("SECRET_KEY"))['userID']

        # Eliminar el tweet de la base de datos si pertenece al usuario autenticado
        cur = conn.cursor()
        query = """
            DELETE FROM tweets
            WHERE tweetid = %s AND userid = %s;
        """
        cur.execute(query, (tweet_id, userID))
        conn.commit()
        cur.close()

        if cur.rowcount == 1:
            data = {"message": "Tweet eliminado exitosamente"}
            return resfunc(data), 200
        else:
            data = {
                "message": "No se encontró el tweet o no tienes permiso para eliminarlo"}
            return resfunc(data), 200

    except Exception as e:
        data = {"message": "Error al conectarse a la base de datos"}
        return resfunc(data), 500


@Tweet.route('/get-comments/<int:tweet_id>', methods=['GET'])
@verify_token
def get_comments_tweet(tweet_id):
    """Get comments for a specific tweet.

    Args:
        tweet_id (int): The ID of the tweet.

    Returns:
        JSON: List of comments and the total number of comments.
    """
    # Get params for pagination
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    # Calculate offset for pagination
    offset = (page - 1) * per_page
    try:
        cur = conn.cursor()
        query_no_pages = "SELECT CEIL(COUNT(*) / %s) AS total_pages FROM comments WHERE tweetid = %s;"
        cur.execute(query_no_pages, (per_page, tweet_id,))
        total_pages = int(cur.fetchall()[0][0])
        final_query = """
        SELECT
            c.*
        FROM
            comments c
        WHERE
            c.tweetid = %s
        ORDER BY
            c.datetime DESC
        LIMIT %s OFFSET %s;
        """
        cur.execute(final_query, (tweet_id, per_page, offset))
        dbres = cur.fetchall()

        if len(dbres) == 0:
            data = {"message": "Tweet no encontrado", "total_comments": 0}
            return resfunc(data), 200

        comments = []
        for comment in dbres:
            comments.append({
                "commentID": comment[0],
                "userID": comment[1],
                "tweetID": comment[2],
                "comment": comment[3],
                "datetime": comment[4]
            })

        data = {"total_pages": total_pages, "comments": comments}
        return resfunc(data), 200
    except Exception as e:
        print(e)
        data = {"message": "Error al conectarse a la base de datos"}
        return resfunc(data), 500
    finally:
        cur.close()
