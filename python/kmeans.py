import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from controllers.query import consultas, curs, grupBy
from controllers.controller import initialize_centroids, calculate_error, assign_centroid, knn
from utils.cq import query1, query2, query3

import sys
import json
import ast

#Establecemos una semilla
np.random.seed(444)

#JSON controlador
input = ast.literal_eval(sys.argv[1])
output = input
cur = output['data_sent']
tipo = output['tipo']

'''
cur = 3
tipo = "compra"
'''



#Variables globales
num = 0
ids = []
name = []
x = []
y = []
cen =[]

#ciclo va guardando los id de productos
consultas(query1)
for row in curs:
   ids.append("{id_product}".format(**row))
   name.append("{name}".format(**row))

#Ciclo, va guardando las veces que ubo compra del producto X
#si tipo es compra

if(tipo == 'compra'):
   for product in ids:
      grupBy(product)
      num = 0
      for row in curs:
         num = num + 1
      x.append(num)

if(tipo == 'precio'):
   for product in ids:
      consultas(str(query3 + product))
      for row in curs:
         x.append(float("{price}".format(**row)))
      
      
#Ciclo que nos va guardando la cantidad de producto vendido
for product in ids:
   consultas(str(query2 + product))
   for row in curs:
      if("{sum(quantity)}".format(**row) == 'None'):
         y.append(0)
      else:
         y.append(int("{sum(quantity)}".format(**row)))

#Asignamos a una tabla pandas los valores correspondientes
df = np.column_stack([x, y])
df = pd.DataFrame(df)

#Creamos nuestra primer gráfico con los datos
fig, ax = plt.subplots()
ax.scatter(x = df[0], y = df[1])

#Calculamos los centroides con el método initialize_centroids
centroids = initialize_centroids(int(cur), df)

#Calculamos los errores por centrodide de cada uno de los puntos
errors = np.array([])
for centroid in range(centroids.shape[0]):
    error = calculate_error(centroids.iloc[centroid, :2], df.iloc[0,:2])
    errors = np.append(errors, error)


#Agregamos en nuestra tabla los campos centoide y error
df['centroid'], df['error'] = assign_centroid(df.iloc[:,:2] ,centroids)

#Volvemos hacer nuestro gráfico pero ahora distinguiendo por color a que centroide pertenece
colors = {0:'red', 1:'blue', 2:'green', 3:'yellow', 4:'brown', 5:'purple'}

#calculamos la suma de los errores :)
df['error'].sum()

#Reasignamos nuevos centroide
#La primera iteración se hace de forma manual
data_columns = [0,1]
centroids = df.groupby('centroid').agg('mean').loc[:,data_columns].reset_index(drop = True)

#llamamos al metodo knn que recalcula los centroides
df['centroid'], _, centroids =  knn(df.drop(['centroid','error'], axis = 1), int(cur))

#Creamos nuestro ultimo grafico pero esta vez con los datos finales
plt.scatter(df.iloc[:,0], df.iloc[:,1],  marker = 'o', c = df['centroid'].apply(lambda x: colors[x]), alpha = 0.5)
plt.scatter(centroids.iloc[:,0], centroids.iloc[:,1],  marker = 'o', s=300,
           c = centroids.index.map(lambda x: colors[x]))

#Mostramos resultados finales
fd = np.column_stack([ids, x, y, df['centroid'], df['error']])
fd = pd.DataFrame(fd)

for data in df['centroid']:
   cen.append(data)
   
#print(ids)

output['ids'] = ids
output['name'] = name
output['x'] = x
output['y'] = y
output['centroids'] = cen
print(json.dumps(output))
sys.stdout.flush()




#Pruebas

#plt.show()
#print(fd)