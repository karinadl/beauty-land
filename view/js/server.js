const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Puedes ajustar el puerto según tus necesidades

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para manejar las solicitudes de la interfaz web y realizar operaciones en la base de datos
app.post('/registrarUsuario', (req, res) => {
    const { userName, lastName, middleName, cell, pass, userRole } = req.body;

    const result = conn.query(
        'INSERT INTO client (userName, lastName, middleName, cell, pass, userRole) VALUES (?, ?, ?, ?, ?, ?)',
        [userName, lastName, middleName, cell, pass, userRole]
    );

    res.send('Usuario registrado con éxito');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
