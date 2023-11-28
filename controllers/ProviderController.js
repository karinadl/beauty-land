const { pool } = require('../db/db');

const newProvider = async (req, res) => {
    const { name, enterprise, contact} = req.body;
    prov = {};
    try{
        await pool.getConnection();
        prov = await pool.query('INSERT INTO provider VALUES (null, ?, ?, ?) RETURNING *', 
        [
            name, 
            enterprise,
            contact
        ]
        );
        res.json(prov);
    }catch(error){
        res.send(error);
    }
};

const listProvider = async (req,res)=>{
    prov = {};
    try{
        await pool.getConnection();
        prov = await pool.query('SELECT * from provider');
        res.json(prov);
    }catch(error){
        res.send(error);
    }
};
const idProvider = async (req,res)=>{
    const id = req.params.id;
    prov = {};
    try{
        await pool.getConnection();
        prov = await pool.query('SELECT * from provider where id_provider = ' + id);
        res.json(prov);
    }catch(error){
        res.send(error);
    }
};

const updateProvider = async (req, res)=>{
    const id = req.params.id;
    const {name, enterprise, contact} = req.body;
    try{
        await pool.getConnection();
        prov = await pool.query('UPDATE provider SET name = ?, enterprise = ?, contact = ? WHERE id_provider = ?',
        [
            name, 
            enterprise,
            contact,
            id
        ]);
        res.json(true);
    }catch(error){
        res.send(error);
    }
};

const deleteProvider = async (req, res) =>{
    const id = req.params.id;
    try{
        await pool.getConnection();
        await pool.query('DELETE FROM provider WHERE id_provider = ?',
        [
            id
        ]);
        res.json(true);
    }catch(error){
        res.send(error);
    }
};



module.exports = {
    newProvider,
    listProvider,
    idProvider,
    updateProvider,
    deleteProvider
};
