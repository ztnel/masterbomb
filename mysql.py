import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="&ZX^UB&7vykP",
    database="testdatabase"
)

mycursor = db.cursor()
# mycursor.execute("CREATE DATABASE testdatabase")