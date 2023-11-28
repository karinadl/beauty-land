//Variables globales
var prueba = "";
var spawner = "";
var data_to_pass_in = {};

//Funcion que llama al proceso de python a partir del objeto json data_to_pass_in
function callpython() {
    const python_process = spawner('python', ['./python/kmeans.py', JSON.stringify(data_to_pass_in)]);
    python_process.stdout.on('data', (data) => { prueba = JSON.parse(data.toString()); });
}

//Creacion del dataset
function createDataset() {
    for (var i = 0; i < prueba['ids'].length; i++) {

        switch (prueba['centroids'][i]) {
            case 0:
                color = "#002B5B";
                break;
            case 1:
                color = "#9f06ff";
                break;
            case 2:
                color = "#40F8FF";
                break;
            case 3:
                color = "#BCA37F";
                break;
            case 4:
                color = "#16FF00";
                break;
        }
        datos.push({
            "title": prueba['name'][i],
            "id": prueba['ids'][i],
            "x": prueba['x'][i],
            "y": prueba['y'][i],
            "color": color,
            "centroid": prueba['centroids'][i]
        });
    }
}

//Constante km retorna dataset con compra 
const km = (req, res) => {
    const clous = req.params.id;
    try {
        spawner = require('child_process').spawn;
        datos = [];

        data_to_pass_in = {
            data_sent: clous,
            tipo: "compra",
            ids: undefined,
            name: undefined,
            x: undefined,
            y: undefined,
            centroids: undefined
        };

        callpython();

        setTimeout(() => {
            createDataset();
            res.json(datos);
        }, 9000);
    } catch (error) {
        res.send(error.message);
    }
}

//kmp retorna dataset con el atributo precio
const kmp = (req, res) => {
    const clous = req.params.id;
    try {
        spawner = require('child_process').spawn;
        datos = [];

        data_to_pass_in = {
            data_sent: clous,
            tipo: "precio",
            ids: undefined,
            name: undefined,
            x: undefined,
            y: undefined,
            centroids: undefined
        };

        callpython();

        setTimeout(() => {
            createDataset();
            res.json(datos);
        }, 9000);

    } catch (error) {
        res.send(error.message);
    }
}

//Exportamos km y kmp como modulos
module.exports = {
    km, kmp
};