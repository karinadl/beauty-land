const { pool } = require('../db/db');


const listProduct = async (req, res) => {
    prod = {};
    try {
        await pool.getConnection();
        prod = await pool.query('SELECT * from product');
        res.json(prod);
    } catch (error) {
        res.send(error);
    }
};

const idProduct = async (req, res) => {
    const id = req.params.id;
    prod = {};
    try {
        await pool.getConnection();
        prod = await pool.query('SELECT * from product where id_product = ' + id);
        res.json(prod);
    } catch (error) {
        res.send(error);
    }
};

const newProduct = async (req, res) => {
    const { id_provider, name, price, description, uses, types, existence } = req.body;
    prod = {};
    try {
        await pool.getConnection();
        prod = await pool.query('INSERT INTO product VALUES (null, ?, ?, ?, ?, ?, ?, ?) RETURNING *', [
            id_provider,
            name,
            price,
            description,
            uses,
            types,
            existence]
        );
        res.json(prod);
    } catch (error) {
        res.send(error);
    }
};

const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { id_provider, name, price, description, uses, types, existence } = req.body;
    try {
        await pool.getConnection();
        await pool.query('UPDATE product SET id_provider = ?, name = ?, price = ?, description = ?, uses = ?, types = ?, existence = ? WHERE id_product = ?',
            [
                id_provider,
                name,
                price,
                description,
                uses,
                types,
                existence,
                id
            ]);
        res.json(true);
    } catch (error) {
        res.send(error);
    }
};

const deleteProduct = async (req, res) => {
    // console.log('Eliminando Producto');
    const id = req.params.id;
    try {
        await pool.getConnection();
        await pool.query('DELETE FROM product WHERE id_product = ?',
            [
                id
            ]);
        res.json(true);
    } catch (error) {
        res.send(error);
    }
};

const existence = async (req, res) => {
    const id = req.params.id;
    const { existence } = req.body;
    try {
        await pool.getConnection();
        prod = await pool.query('UPDATE product SET existence = ? where id_product = ?',
            [
                existence,
                id
            ]);
        res.json(true);
    } catch (error) {
        res.send(error);
    }
};


module.exports = {
    listProduct,
    idProduct,
    newProduct,
    updateProduct,
    deleteProduct,
    existence
};
