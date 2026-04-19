const db = require('../config/db');

exports.getHabitaciones = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM habitaciones');
        res.json(results);
    } catch (err) {
        console.error('Error al buscar habitaciones:', err);
        res.status(500).json({ error: 'Error al buscar habitaciones' });
    }
};

exports.addHabitacion = async (req, res) => {
    const { hotel_id, tipo, capacidad, cantidad_total, disponible_desde, disponible_hasta } = req.body;
    try {
        const sql = `INSERT INTO habitaciones 
                     (hotel_id, tipo, capacidad, cantidad_total, disponible_desde, disponible_hasta) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [hotel_id, tipo, capacidad, cantidad_total, disponible_desde, disponible_hasta]);
        res.json({ message: 'Habitación guardada con fechas' });
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar habitación' });
    }
};

exports.deleteHabitacion = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM habitaciones WHERE id = ?';
        await db.query(sql, [id]);
        res.json({ message: 'Habitación eliminada' });
    } catch (err) {
        console.error('Error al eliminar habitación:', err);
        res.status(500).json({ error: 'Error al eliminar la habitación' });
    }
};