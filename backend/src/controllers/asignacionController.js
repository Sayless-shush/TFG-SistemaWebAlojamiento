const db = require('../config/db'); 
const servicioAsignacion = require('../services/assignmentService'); 

exports.ejecutarAsignacion = async (req, res) => {
    try {
        const [clubes] = await db.query('SELECT * FROM clubes');
        const [equipos] = await db.query('SELECT * FROM equipos');
        const [hoteles] = await db.query('SELECT * FROM hoteles');
        const [habitaciones] = await db.query('SELECT * FROM habitaciones');

        const resultado = servicioAsignacion.asignarAutomaticamente(clubes, equipos, hoteles, habitaciones);

        res.json(resultado);
    } catch (error) {
        console.error('Error en la asignación:', error);
        res.status(500).json({ error: 'Error al ejecutar el algoritmo' });
    }
};