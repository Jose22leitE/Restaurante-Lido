const express = require('express');
const app = express();
const port = 3000;

// Obtener la vista solicitada
app.get('/:view?', (req, res) => {
    const view = req.params.view || 'home';
    console.log(view); // Imprime la vista solicitada en la consola
    res.send(`Vista solicitada: ${view}`); // Envía una respuesta al cliente
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
