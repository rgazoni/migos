#For past records
from random import randrange, choice
from datetime import datetime
from dotenv import load_dotenv
import uuid
import calendar
import time
import psycopg2
import os

load_dotenv()

host = os.getenv('host')
dbname = os.getenv('dbname')
user = os.getenv('user')
password = os.getenv('password')
sslmode = "require"

print("[" + datetime.today().strftime('%Y-%m-%d %H:%M:%S') + "] - " + "Proccess has been initialized")

conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string)

print("[" + datetime.today().strftime('%Y-%m-%d %H:%M:%S') + "] - " + "Connection established")

cursor = conn.cursor()

users = [
    {
        "user_id": "bc6b94dd-7008-4717-93d2-707aa42bbbb5",
        "name": "Cleitinho",
        "tags": ["supermercado", "eletrônico"]
    },
    {
        "user_id": "75ecd8d2-4f44-4f24-b6f1-a4c0fcc82ecf",
        "name": "Japonês",
        "tags": ["roupas", "jogos", "games"]
    },
]

user =  choice(users)

print("[" + datetime.today().strftime('%Y-%m-%d %H:%M:%S') + "] - " + "User that has been chosen: " + user["name"])

# To create past records you can use a range with timestamps as follows: randrange(1696203611, 1697888293) 

statement = {
    "transaction_id": str(uuid.uuid4()),
    "amount": randrange(700, 6800),
    "time": calendar.timegm(time.gmtime()),
    "tag": choice(user['tags']),
    "user_id": user['user_id'],
}

try:
    # Store this statement into pg DB
    cursor.execute("INSERT INTO bank_api (transaction_id, amount, time, tag, user_id) \
                    VALUES ('{0}', {1}, {2}, '{3}', '{4}');".format(
                        statement["transaction_id"],
                        statement["amount"],
                        statement["time"],
                        statement["tag"],
                        statement["user_id"]
                    )
    )
    print("[" + datetime.today().strftime('%Y-%m-%d %H:%M:%S') + "] - " + "RUN: Finished insert into table")
except:
	print("[" + datetime.today().strftime('%Y-%m-%d %H:%M:%S') + "] - " + "RUN: An error occurred while inserting into database")

conn.commit()
cursor.close()
conn.close()