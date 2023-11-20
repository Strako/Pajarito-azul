"""
    This file contains the database object that is used to interact with the database.
"""
import pymysql
from dotenv import load_dotenv
import os
import _mysql_connector
from mysql.connector import Error, pooling
load_dotenv()
host = os.getenv("DBHOST")
user = os.getenv("DBUSER")
passwd = os.getenv("DBPASS")
dbname = os.getenv("DBNAME")

# Create a connection object to the database
db_config = {
    "host": host,
    "user": user,
    "passwd": passwd,
    "database": dbname
}
pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=20, **db_config)

conn = pool.get_connection()
