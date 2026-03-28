const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Configura
app.use(cors());
app.use(express.json());

// conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((error) => {
    if (error) {
        console.error('Error conectando a la base de datos:', error.message);
        return;
    }
    console.log('¡Conectado a la base de datos MySQL con éxito!');
});


// Hoteles
app.get('/api/hoteles', (req, res) => {
    db.query('SELECT * FROM hoteles', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar hoteles' });
        }
        res.json(results);
    });
});


// Añadir un nuevo hotel
app.post('/api/hoteles', (req, res) => {
    const { nombre, categoria, cerca_autobus } = req.body;
    
    const sql = 'INSERT INTO hoteles (nombre, categoria, cerca_autobus) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, categoria, cerca_autobus], (err, results) => {
        if (err) {
            console.error('Error al guardar:', err);
            return res.status(500).json({ error: 'Error al guardar el hotel' });
        }
        res.json({ message: '¡Hotel guardado con éxito!', id: results.insertId });
    });
});

// Clubs
app.get('/api/clubes', (req, res) => {
    db.query('SELECT * FROM clubes', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar clubes' });
        res.json(results);
    });
});

// Añadir un nuevo club
app.post('/api/clubes', (req, res) => {
    const { nombre, contacto_nombre, contacto_email } = req.body;
    const sql = 'INSERT INTO clubes (nombre, contacto_nombre, contacto_email) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, contacto_nombre, contacto_email], (err, results) => {
        if (err) {
            console.error('Error al guardar club:', err);
            return res.status(500).json({ error: 'Error al guardar el club' });
        }
        res.json({ message: '¡Club guardado con éxito!', id: results.insertId });
    });
});
// Equipos y categorias

app.get('/api/equipos', (req, res) => {
    db.query('SELECT * FROM equipos', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar equipos' });
        res.json(results);
    });
});

// Añadir un nuevo equipo
app.post('/api/equipos', (req, res) => {
    const { club_id, categoria, num_jugadores } = req.body;
    const sql = 'INSERT INTO equipos (club_id, categoria, num_jugadores) VALUES (?, ?, ?)';
    
    db.query(sql, [club_id, categoria, num_jugadores], (err, results) => {
        if (err) {
            console.error('Error al guardar equipo:', err);
            return res.status(500).json({ error: 'Error al guardar el equipo' });
        }
        res.json({ message: '¡Equipo guardado!', id: results.insertId });
    });
});

// Encender el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

