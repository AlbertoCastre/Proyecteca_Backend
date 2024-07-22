const express = require('express');
const app = express.Router(); // Usa `Router` para definir las rutas

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'Connection successful' });
});

module.exports = app;
