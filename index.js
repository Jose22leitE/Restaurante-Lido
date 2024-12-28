const express = require('express'); 
const app = express();
const path = require('path');
const port = 3000;

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

// Obtener la vista solicitada
app.get('/:view?', (req, res) => {
    const view = req.params.view || 'home';
    res.render(view);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
