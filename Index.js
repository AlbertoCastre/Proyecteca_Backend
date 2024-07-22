require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3333', // Reemplaza con la URL de tu cliente React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permitir cookies y encabezados autorizados
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargamos el archivo de rutas
app.use(require('./routes/carreras'));
app.use(require('./routes/estados'));
app.use(require('./routes/proyectos'));
app.use(require('./routes/roles'));
app.use(require('./routes/usuarios'));

app.use(require('./routes/test'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('El servidor escucha en el puerto ' + PORT);
});



module.exports = app;
