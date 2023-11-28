const { pool } = require('../db/db');

const newClient = async (req, res) => {
    const { name, middleName, lastName, cell, pass} = req.body;
    cli = {};
    try{
        await pool.getConnection();
        cli = await pool.query('INSERT INTO client VALUES (null, ?, ?, ?, ?, ?) RETURNING *', 
        [
            name, 
            middleName,
            lastName, 
            cell,
            pass
        ]
        );
        res.json(cli);
    }catch(error){
        res.send(error);
    }
};

const listClient = async (req, res) => {
    cli = {}; 
    try{
        await pool.getConnection();
        cli = await pool.query('SELECT * from client');
        res.json(cli);
    }catch(error){
    res.send(error);
    }
};

const idClient =  async (req, res) => {
    const id = req.params.id;
    cli = {};
    try{
        await pool.getConnection();
        cli = await pool.query('SELECT * from client where id_client = ' + id);
        res.json(cli);
    }catch(error){
        res.send(error);
    }
    };

const deleteClient = async (req, res) =>{
    const id = req.params.id;
    try{
        await pool.getConnection();
        await pool.query('DELETE FROM client WHERE id_client = ?',
        [
            id
        ]);
        res.json(true);
    }catch(error){
        res.send(error);
    }
};

const updateClient = async (req,res)=>{
    const id = req.params.id;
    const {id_client, name, middleName, lastName, cell, pass} = req.body;
    try{
        await pool.getConnection();
       cli = await pool.query('UPDATE client SET name = ?, middleName = ?, lastName = ?, cell = ?, pass = ? WHERE id_client = ?',
        [
            name, 
            middleName,
            lastName,
            cell,
            pass,
            id
        ]);
        res.json(true);
    }catch(error){
        res.send(error);
    }
}; 

module.exports = {
    newClient,
    listClient,
    idClient,
    deleteClient,
    updateClient
}