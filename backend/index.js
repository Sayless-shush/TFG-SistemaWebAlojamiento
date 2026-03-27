const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración básica
app.use(cors());
app.use(express.json());

// Crear la conexión a la base de datos usando tu archivo .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect((error) => {
    if (error) {
        console.error('Error conectando a la base de datos:', error.message);
        return;
    }
    console.log('¡Conectado a la base de datos MySQL con éxito!');
});

// --- TUS RUTAS (API) VAN AQUÍ ---

// Ruta para ver todos los hoteles
app.get('/api/hoteles', (req, res) => {
    // Le pedimos a MySQL que seleccione TODO de la tabla hoteles
    db.query('SELECT * FROM hoteles', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar hoteles' });
        }
        // Si va bien, enviamos los resultados en formato JSON
        res.json(results);
    });
});

// --------------------------------

// Encender el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});