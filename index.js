const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Configuración del motor de plantillas y vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configura la carpeta 'view/css' para servir archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'views/css')));

// Middleware para autenticación y roles
const isAuthenticated = (req, res, next) => {
    // Aquí podrías validar sesiones, cookies o JWT
    if (req.query.auth === 'true') { // Ejemplo básico
        return next();
    }
    res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.query.admin === 'true') { // Ejemplo con query params
        return next();
    }
    res.status(403).render('403', { title: 'Acceso denegado' });
};

// Rutas públicas
app.get('/:view?', (req, res) => {
    const view = req.params.view || 'home';
    const publicViews = ['home', 'contacto', 'menu', 'reserva'];

    if (publicViews.includes(view)) {
        res.render(view, { title: view.charAt(0).toUpperCase() + view.slice(1) });
    } else {
        res.status(404).render('404', { title: 'Página no encontrada' });
    }
});

// Rutas protegidas (requieren autenticación)
app.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
    res.render('dashboard', { title: 'Panel de Administración' });
});

app.get('/gestion-menu', isAuthenticated, isAdmin, (req, res) => {
    res.render('gestion-menu', { title: 'Gestión de Menú' });
});

app.get('/gestion-reservas', isAuthenticated, isAdmin, (req, res) => {
    res.render('gestion-reservas', { title: 'Gestión de Reservas' });
});

// Página de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login', { title: 'Inicio de sesión' });
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Error del servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
