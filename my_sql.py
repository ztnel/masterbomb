import mysql.connector
from datetime import datetime

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="&ZX^UB&7vykP",
    database="testdatabase"
)

cursor = db.cursor()
# cursor.execute("CREATE TABLE Test (id int PRIMARY KEY NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL, created datetime NOT NULL, gender ENUM('M', 'F') NOT NULL)")
# cursor.execute ("INSERT INTO Test (name, created, gender) VALUES (%s,%s,%s)", ("gio", datetime.now(), "M"))
# db.commit()
# cursor.execute("SELECT * FROM Test WHERE gender = 'M' ORDER BY id ASC")
# cursor.execute("ALTER TABLE Test ADD COLUMN food VARCHAR(50) NOT NULL")
# cursor.execute("ALTER TABLE Test DROP COLUMN food")
# cursor.execute("ALTER TABLE Test CHANGE name first_name VARCHAR(50)")
# cursor.execute("DESCRIBE Test")

users = [("tim", "tech"),
         ("alan", "lana"),
         ("sara", "saraaa")]

user_scores = [(45,100),
               (30,40),
               (46,126)]
# Q1 = "CREATE TABLE Users (id int PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50), passwd VARCHAR(50))"
# Q2 = "CREATE TABLE Scores (userId int PRIMARY KEY, FOREIGN KEY(userId) REFERENCES Users(id), game1 int DEFAULT 0, game2 int DEFAULT 0)"

# cursor.execute(Q1)
# cursor.execute(Q2)

# cursor.execute("SHOW TABLES")
Q3 = "INSERT INTO Users (name, passwd) VALUES (%s,%s)"
Q4 = "INSERT INTO Scores (userId, game1, game2) VALUES (%s,%s,%s)"

for x, usr in enumerate(users):
    cursor.execute(Q3, usr)
    last_id = cursor.lastrowid
    cursor.execute(Q4, (last_id,) + user_scores[x])

db.commit()

cursor.execute("SELECT * FROM Users")
for x in cursor:
    print(x)

cursor.execute("SELECT * FROM Scores")
for x in cursor:
    print(x)