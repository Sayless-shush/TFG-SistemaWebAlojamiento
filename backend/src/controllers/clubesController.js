const db = require('../config/db');

exports.getClubes = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM clubes');
        res.json(results);
    } catch (err) {
        console.error('Error al buscar clubes:', err);
        res.status(500).json({ error: 'Error al buscar clubes' });
    }
};

exports.addClub = async (req, res) => {
    const { nombre, contacto_nombre, contacto_email } = req.body;
    try {
        const sql = 'INSERT INTO clubes (nombre, contacto_nombre, contacto_email) VALUES (?, ?, ?)';
        const [results] = await db.query(sql, [nombre, contacto_nombre, contacto_email]);
        res.json({ message: 'Club guardado', id: results.insertId });
    } catch (err) {
        console.error('Error al guardar club:', err);
        res.status(500).json({ error: 'Error al guardar el club' });
    }
};
