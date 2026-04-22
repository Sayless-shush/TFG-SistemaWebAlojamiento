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
    const { nombre, contacto_nombre, contacto_email, contacto_telefono, comercial, tiene_bus } = req.body;
    try {
        const busVal = tiene_bus ? 1 : 0; 
        const sql = 'INSERT INTO clubes (nombre, contacto_nombre, contacto_email, contacto_telefono, comercial, tiene_bus) VALUES (?, ?, ?, ?, ?, ?)';
        const [results] = await db.query(sql, [nombre, contacto_nombre, contacto_email, contacto_telefono, comercial, busVal]);
        res.json({ message: 'Club guardado', id: results.insertId });
    } catch (err) {
        console.error('Error al guardar club:', err);
        res.status(500).json({ error: 'Error al guardar el club' });
    }
};

exports.deleteClub = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM clubes WHERE id = ?';
        await db.query(sql, [id]);
        res.json({ message: 'Club eliminado' });
    } catch (err) {
        console.error('Error al eliminar club:', err);
        res.status(500).json({ error: 'Error al eliminar el club' });
    }
};
