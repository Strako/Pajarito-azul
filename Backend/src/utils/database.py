"""
    This file contains the database object that is used to interact with the database.
"""
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()
host = os.getenv("DBHOST")
user = os.getenv("DBUSER")
passwd = os.getenv("DBPASS")
dbname = os.getenv("DBNAME")
# Create a connection object to the database
conn = pymysql.connect(
    host=host,
    user=user,
    password=passwd,
    database=dbname
)
