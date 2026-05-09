const express = require('express');
const cors = require('cors');
const hotelesRoutes = require('./routes/hotelesRoutes');
const clubesRoutes = require('./routes/clubesRoutes');
const equiposRoutes = require('./routes/equiposRoutes');
const habitacionesRoutes = require('./routes/habitacionesRoutes');
const asignacionRoutes = require('./routes/asignacionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/hoteles', hotelesRoutes);
app.use('/api/clubes', clubesRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/asignar', asignacionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo está mal en el servidor' });
});

module.exports = app;
