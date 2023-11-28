import mysql.connector
from config import u, p, h, db, po

#Conectar a base de datos
connect = mysql.connector.connect(
    user=u, password=p, host=h, database=db, port=po
)

