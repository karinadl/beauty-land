from db.db import connect

curs = connect.cursor(dictionary=True)
#elemento cursor

#Consulta global
def consultas (query = ""):
    curs.execute(query)

#Consulta especifica al proyecto

def grupBy(idp):
    query = "select id_purchase from sales where id_product = " + idp + " group by id_purchase"
    curs.execute(query)

