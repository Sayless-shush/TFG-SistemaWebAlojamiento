const db = require('../config/db');

exports.getHoteles = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM hoteles');
        res.json(results);
    } catch (err) {
        console.error('Error al buscar hoteles:', err);
        res.status(500).json({ error: 'Error al buscar hoteles' });
    }
};

exports.addHotel = async (req, res) => {
    const { nombre, categoria, cerca_autobus } = req.body;
    try {
        const sql = 'INSERT INTO hoteles (nombre, categoria, cerca_autobus) VALUES (?, ?, ?)';
        const [results] = await db.query(sql, [nombre, categoria, cerca_autobus]);
        res.json({ message: 'Hotel guardado', id: results.insertId });
    } catch (err) {
        console.error('Error al guardar hotel:', err);
        res.status(500).json({ error: 'Error al guardar el hotel' });
    }
};

exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM hoteles WHERE id = ?';
        await db.query(sql, [id]);
        res.json({ message: 'Hotel y sus habitaciones eliminados' });
    } catch (err) {
        console.error('Error al eliminar hotel:', err);
        res.status(500).json({ error: 'Error al eliminar el hotel' });
    }
};
