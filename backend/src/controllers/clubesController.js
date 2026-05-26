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
    try {
        // catrgoria pagada
        const { nombre, contacto_nombre, contacto_telefono, contacto_email, comercial, tiene_bus, categoria_pagada } = req.body;
        
        await db.query(
            'INSERT INTO clubes (nombre, contacto_nombre, contacto_telefono, contacto_email, comercial, tiene_bus, categoria_pagada) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, contacto_nombre, contacto_telefono, contacto_email, comercial, tiene_bus, categoria_pagada]
        );
        
        res.json({ success: true, message: 'Club creado correctamente' });
    } catch (error) {
        console.error('Error al guardar el club:', error);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
};

exports.updateClubHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { hotel_manual_id } = req.body;
        await db.query('UPDATE clubes SET hotel_manual_id = ? WHERE id = ?', [hotel_manual_id, id]);
        res.json({ success: true, message: 'Hotel manual actualizado' });
    } catch (error) {
        console.error('Error al actualizar el hotel manual:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

exports.updateClubComentarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentarios } = req.body;
        await db.query('UPDATE clubes SET comentarios = ? WHERE id = ?', [comentarios, id]);
        res.json({ success: true, message: 'Comentarios actualizados' });
    } catch (error) {
        console.error('Error al actualizar comentarios:', error);
        res.status(500).json({ error: 'Error al actualizar' });
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
