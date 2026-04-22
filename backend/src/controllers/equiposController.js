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
    const { club_id, categoria, num_jugadores, num_entrenadores, num_acompanantes, fecha_check_in, fecha_check_out, tipo_habitacion_deseada, observaciones, tipologia } = req.body;
    try {
        const sql = `INSERT INTO equipos 
                     (club_id, categoria, num_jugadores, num_entrenadores, num_acompanantes, fecha_check_in, fecha_check_out, tipo_habitacion_deseada, observaciones, tipologia) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [club_id, categoria, num_jugadores, num_entrenadores, num_acompanantes, fecha_check_in, fecha_check_out, tipo_habitacion_deseada, observaciones, tipologia]);
        res.json({ message: 'Equipo guardado con detalles' });
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar equipo' });
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
