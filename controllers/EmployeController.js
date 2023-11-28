const { pool } = require('../db/db');
var user = {
    "name": "",
    "rol": ""
}


const idEmploye = async (req, res) => {
    const id = req.params.id;
    emplo = {};
    try {
        await pool.getConnection();
        emplo = await pool.query('SELECT * from employe where id_employe = ?', [id]);
        res.json(emplo);
    } catch (error) {
        res.status(500).send(error);
    }
};

const listEmploye =  async (req, res) => {
    emplo = {};
    try{
        await pool.getConnection();
        emplo = await pool.query('SELECT * from employe');
        res.json(emplo);
    }catch(error){
        res.send(error);
    }
};

const newEmploye = async (req, res) => {
    const { name, middleName, lastName, cell, pass, rol} = req.body;
    emplo = {};
    try{
        await pool.getConnection();
        emplo = await pool.query('INSERT INTO employe VALUES (null, ?, ?, ?, ?, ?, ?) RETURNING *', 
        [
            name, 
            middleName,
            lastName, 
            cell,
            pass,
            rol
        ]
        );
        res.json(emplo);
    }catch(error){
        res.send(error);
    }
};

const updateEmploye = async (req,res)=>{
    const id = req.params.id;
    const {id_employe, name, middleName, lastName, cell, pass, rol } = req.body;
    try{
        await pool.getConnection();
        await pool.query('UPDATE employe SET name = ?, middleName = ?, lastName = ?, cell = ?, pass = ?, rol = ? WHERE id_employe = ?',
        [
            name, 
            middleName,
            lastName,
            cell,
            pass,
            rol, 
            id
        ]);
        res.json(true);
    }catch(error){
        res.send(error);
    }
}; 

const deleteEmploye = async (req, res) =>{
    const id = req.params.id;
    try{
        await pool.getConnection();
        await pool.query('DELETE FROM employe WHERE id_employe = ?',
        [
            id
        ]);
        res.json(true);
    }catch(error){
        res.send(error);
    }
};

const getUser = (req, res) => {
    res.json(user);
};

const setUser = (req, res) => {
    const { nom, rol } = req.body;
    user.name = nom;
    user.rol = rol;
    res.json(user);
};

const getName = async (req, res) => {
    //ir a la base de datos y traerme el nombre, contraseña y rol del nombre que estoy buscando
    const nombre = req.params.name;
    try{
        await pool.getConnection();
        emplo = await pool.query('SELECT * from employe where name = ?', [nombre]);
        res.json(emplo);
    }catch(error){
        const errorJ = {
            "error":"false"
        }
        res.json(errorJ);
    }
};

module.exports = {
    newEmploye,
    updateEmploye,
    listEmploye,
    idEmploye,
    deleteEmploye,
    getUser,
    setUser, 
    getName
};


