const db = require('../config/db');

exports.getEquipos = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM equipos');
        res.json(results);
    } catch (err) {
        console.error('Error al buscar equipos:', err);
        res.status(500).json({ error: 'Error al buscar equipos' });
    }
};

exports.addEquipo = async (req, res) => {
    const { club_id, categoria, num_jugadores } = req.body;
    try {
        const sql = 'INSERT INTO equipos (club_id, categoria, num_jugadores) VALUES (?, ?, ?)';
        const [results] = await db.query(sql, [club_id, categoria, num_jugadores]);
        res.json({ message: '¡Equipo guardado!', id: results.insertId });
    } catch (err) {
        console.error('Error al guardar equipo:', err);
        res.status(500).json({ error: 'Error al guardar el equipo' });
    }
};

exports.deleteEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM equipos WHERE id = ?';
        await db.query(sql, [id]);
        res.json({ message: 'Equipo eliminado' });
    } catch (err) {
        console.error('Error al eliminar equipo:', err);
        res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
};
