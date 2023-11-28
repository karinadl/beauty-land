//Variables globales
var prueba = "";
var spawner = "";
var data_to_pass_in = {};

//Funcion que llama al proceso de python a partir del objeto json data_to_pass_in
function callpython() {
    const python_process = spawner('python', ['./python/serie.py', JSON.stringify(data_to_pass_in)]);
    python_process.stdout.on('data', (data) => { prueba = JSON.parse(data.toString()); });
}

//Creacion del dataset
function createDataset() {
    try {
        datos = [];
        for (var i = 0; i < prueba['table'].length; i++) {

            //test[date][total][table]
            //predict[date][total][table]
            datos.push({
                "year": prueba['year'][i],
                "month": prueba['month'][i],
                "day": prueba['day'][i],
                "total": prueba['total'][i],
                "table": prueba['table'][i]
            });
        }

    } catch (ex) {
        console.log(ex.message);
    }

}

//arima retorna dataset con las fechas y datos correspondientes
const arima = (req, res) => {
    try {
        spawner = require('child_process').spawn;
        datos = [];

        data_to_pass_in = {
            data_sent: 'Requerimientos para series de tiempo',
            year: undefined,
            month: undefined,
            day: undefined,
            total: undefined,
            table: undefined
        };

        callpython();

        setTimeout(() => {
            createDataset();
            res.json(datos);
        }, 27000);

    } catch (error) {
        console.log(error.message);
    }
}

//Exportamos km y kmp como modulos
module.exports = {
    arima
}