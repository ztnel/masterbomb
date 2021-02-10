import mariadb
import sys

# Adds contact
def add_contact(cursor, first_name, last_name, email):
   """Adds the given contact to the contacts table"""
   cursor.execute("INSERT INTO test.contacts(first_name, last_name, email) VALUES (?, ?, ?)",
      (first_name, last_name, email))

# Instantiate Connection
try:
    db = mariadb.connect(
            user="connpy_test",
            password="passwd",
            host="localhost",
            port=3306
        )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

cursor = db.cursor()

add_contact(cursor, "Christian", "Sargusingh", "rqpegasus@gmail.com")

# Close Connection
db.close()
