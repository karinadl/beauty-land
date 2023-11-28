# Manipulación y tratamiento de Datos
import numpy as np
import pandas as pd
from pmdarima import auto_arima

#importar consulta BD
from controllers.query import consultas, curs
from utils.cq import query4

# Visualización de datos Graficos
import plotly.express as px
import matplotlib.pyplot as plt
#matplotlib inline
plt.style.use('ggplot')

# Modelación Arima SARIMAX
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf,plot_pacf
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller

# Métrica de Evaluación
'''
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse
from sklearn import metrics
'''

# No presentar advertencias
import warnings
warnings.filterwarnings("ignore")

# Dataset
import sys
import json
import ast

#Variables globales

date = []
total = []
pvalue = 0
years = []
month = []
day = []




input = ast.literal_eval(sys.argv[1])
output = input
message = output['data_sent']



#consultas
consultas(query4)
for row in curs:
    date.append("{year}".format(**row) + "-" + "{month}".format(**row) + "-" + "1")
    total.append(float("{total}".format(**row)))

#Asignamos a una tabla pandas los valores correspondientes
df = np.column_stack([date, total])
df = pd.DataFrame(df)
#print(df)

#Convertir a formato datatime y float a los valores de la tabla
from datetime import datetime
df[0] = pd.to_datetime(df[0])
df[1] = pd.to_numeric(df[1])

nuevo = pd.DataFrame();
nuevo['date'] = df[0]
nuevo['total'] = df[1]

df = df.set_index(0)
#print(df.head())

#fig = px.line(df, x=df.index, y=1,template = "plotly_dark",
#              title="Ganancias por mes")
#fig.show()

#[p, d, q]
#[0, 0, 0]
#Prueba Dickey_Fuller (determinar el valor de d)
def Prueba_Dickey_Fuller(series , column_name):
    #print (f'Resultados de la prueba de Dickey-Fuller para columna: {column_name}')
    dftest = adfuller(series, autolag='AIC')
    dfoutput = pd.Series(dftest[0:4], index=['Test Statistic','p-value','No Lags Used','Número de observaciones utilizadas'])
    for key,value in dftest[4].items():
       dfoutput['Critical Value (%s)'%key] = value
    #print (dfoutput)
    return dftest[1]
    '''if dftest[1] <= 0.05:
        print("Conclusion:====>")
        print("Rechazar la hipótesis nula")
        print("Los datos son estacionarios")
    else:
        print("Conclusion:====>")
        print("No se puede rechazar la hipótesis nula")
        print("Los datos no son estacionarios")'''

##Mandamos a llamar el metodo de dickey_fuller
diferencia = 0 
pvalue = Prueba_Dickey_Fuller(df[1],"1")
#print(pvalue)
nameColumn = "total"
df1=df.copy()
#Hacer que se automatico para los diferentes tipos de diff
while(pvalue > 0.05):
    diferencia = diferencia + 1

    # Take first difference
    #*Si diferencia = 3 [total_diff_diff]
    nameColumn += "_diff"
    df1[nameColumn] = df1[diferencia].diff()

    # Remove the first data point
    df1.dropna(inplace=True)
    pvalue = Prueba_Dickey_Fuller(df1[nameColumn],nameColumn)
    # Take a look at the head of the dataset
    #df1.head()

'''
plt.rcParams["figure.figsize"] = (12, 8) 
a = seasonal_decompose(df1["total_diff"], model = "add")
a.plot();
'''

#?Establecemos datos de entrenamiento y datos de pruebas
porcen = int(len(df)*.42)
train_data = df[:len(df)-porcen] #58% 
test_data = df[len(df)-porcen:] #42%
test=test_data.copy()

#print(train_data.shape, test_data.shape)
#print(test_data)

modelo_auto=auto_arima(train_data,start_p=0,d=1,start_q=0,
          max_p=4,max_d=2,max_q=4, start_P=0,
          D=1, start_Q=0, max_P=2,max_D=1,
          max_Q=2, m=12, seasonal=True,
          error_action='warn',trace=False,
          supress_warnings=True,stepwise=True,
          random_state=20,n_fits=50)
#print(modelo_auto)

#0 dates y 1 total
#ARIMA(p,d,q)(ps,ds,qs)[month]

arima_model = SARIMAX(train_data[1], order = (modelo_auto.order[0],modelo_auto.order[1],modelo_auto.order[2]), seasonal_order = (modelo_auto.seasonal_order[0],modelo_auto.seasonal_order[1],modelo_auto.seasonal_order[2],modelo_auto.seasonal_order[3]))
arima_result = arima_model.fit(disp=False)
#arima_result.summary()

arima_pred = arima_result.predict(start = len(train_data), end = len(df)-1, typ="levels").rename("ARIMA Predictions")
#print(arima_pred)

arima_pred2 = arima_result.predict(start='2022-12-01',end='2023-6-01', typ="levels").rename("ARIMA Predictions 2")

'''
plt.style.use('seaborn-v0_8')
plt.rcParams["figure.figsize"] = (10, 4)

plt.plot(test_data[1],color="blue" ,label="Original")
plt.plot(arima_pred2, color="lime", label="Predicciones")
plt.title("Predicción con Modelo Arima", fontsize=20);
plt.xlabel('Meses')
plt.ylabel('')
plt.legend( fontsize=10);
plt.show();

'''

#dateOutput = test_data[0] + arima_pred2[0]
#totalOutput = test_data[1] + arima_pred2[1]
#table = test_data.len[origin] + arima_pred2.len[Predict]
nuevo = nuevo[len(df)-porcen:]
dateOutput = []

for date in nuevo['date']:
    fecha = str(date).split(" ")
    y = fecha[0].split("-")
    years.append(y[0])
    month.append(y[1])
    day.append(y[2])

#print(dateOutput)

for date in arima_pred2.index:
    predFecha = str(date).split(" ")
    y = predFecha[0].split("-")
    years.append(y[0])
    month.append(y[1])
    day.append(y[2])

#print(dateOutput)

totalOutput = []

for totalP in nuevo['total']:
    totalOutput.append(totalP)

for total in arima_pred2:
    totalOutput.append(total)

tableOutput = []

for table in nuevo['total']:
   tableOutput.append('origin')

for table in arima_pred2:
    tableOutput.append('predict')

#print(month)


output['year'] = years
output['month'] = month
output['day'] = day
output['total'] = totalOutput
output['table'] = tableOutput
print(json.dumps(output))
sys.stdout.flush()


