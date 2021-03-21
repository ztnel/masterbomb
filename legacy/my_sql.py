import mariadb
import sys

def add_contact(cursor, first_name:str, last_name:str, email:str):
    """Adds the given contact to the contacts table"""
    cursor.execute("INSERT INTO test.contacts(first_name, last_name, email) VALUES (?, ?, ?)",
        (first_name, last_name, email))

def print_contacts(cursor):
    """Retrieves the list of contacts from the database and prints to stdout"""
    # Initialize Variables
    contacts = []
    # Retrieve Contacts
    cursor.execute("SELECT first_name, last_name, email FROM test.contacts")
    # Prepare Contacts
    for (first_name, last_name, email) in cursor:
        contacts.append(f"{first_name} {last_name} <{email}>")
    # List Contacts
    print("\n".join(contacts))

def replace_contact(cursor, contact_id:int, first_name:str, last_name:str, email:str):
    """Replaces contact with the given `contact_id` with new values"""
    cursor.execute("REPLACE INTO test.contacts VALUES (?, ?, ?, ?)",
        (contact_id, first_name, last_name, email))

def update_contact_last_name(cursor, email:str, last_name:str):
    """Updates last name of a contact in the table"""
    cursor.execute("UPDATE test.contacts SET last_name=? WHERE email=?",
        (last_name, email))

# Instantiate Connection
try:
    db = mariadb.connect(
            user="connpy_test",
            password="passwd",
            host="localhost",
            port=3306
        )
except mariadb.Error as exc:
    print(f"Error connecting to MariaDB Platform: {exc}")
    sys.exit(1)

cursor = db.cursor()

add_contact(cursor, "Christian", "Sargusingh", "rqpegasus@gmail.com")
add_contact(cursor, "Christian", "Sargusingh", "yelp.com")
replace_contact(cursor, 1, "Bob", "Marley", "bob@marley.com")
replace_contact(cursor, 1, "Bobby", "Marley", "bob@marley.com")
update_contact_last_name(cursor, "rqpegasus@gmail.com", "Lenny")
print_contacts(cursor)
# Close Connection
db.close()
