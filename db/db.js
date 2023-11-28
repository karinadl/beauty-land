const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '010601',
    database: 'afrodita',
    port: 3307
});

module.exports = { pool };
//tres usuarios dentro del login.
//Admin, Cliente
//Vista del admin diferente
//Index tiene que ser informativo para el usuario
//Mision vision valores historia. Proyeccion a futuro

//Saber como hacer todo vista para el cliente :c
//Agregar contraseña a los usuarios 
//View es libre pero si hay que hacer buenas cosas