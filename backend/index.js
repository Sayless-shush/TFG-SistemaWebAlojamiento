const app = require('./src/app');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(` Servidor backend corriendo a tope en http://localhost:${port}`);
});
