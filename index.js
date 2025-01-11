const express = require("express");
const path = require("path");
const User = require("./models/userModels.js");
const Swal = require('sweetalert2')

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Configuración del motor de plantillas y vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configura la carpeta 'view/css' para servir archivos estáticos
app.use("/css", express.static(path.join(__dirname, "public/css")));

// Configura la carpeta 'view/js' para servir archivos estáticos
app.use("/js", express.static(path.join(__dirname, "public/js")));

// Configura la carpeta 'view/img' para servir archivos estáticos
app.use("/img", express.static(path.join(__dirname, "public/img")));


// Rutas públicas
app.get("/:view?", (req, res) => {
  const view = req.params.view || "home";
  const publicViews = ["home", "contacto", "menu", "reserva","login"];

  if (publicViews.includes(view)) {
    res.render(view, { title: view.charAt(0).toUpperCase() + view.slice(1) });
  } else {
    res.status(404).render("404", { title: "Página no encontrada" });
  }
});

// Rutas protegidas
app.post('/register', async (req, res) => {
  const { Nombre, Contraseña, Telefono, Correo } = req.body;
  const isRegister = await User.registroUsuario(Nombre, Contraseña, Telefono, Correo);
  if (isRegister !== true) {
    res.status(400).json({
      success: false,
      message: 'Errores de validación',
      icono: 'error',
      titulo: 'Error',
      texto: isRegister
    });
  } else {
    res.json({
      success: true,
      message: `Usuario registrado correctamente, Bienvenido ${Nombre}`,
      icono: 'success',
      titulo: 'Bienvenido',
      texto: `Usuario registrado correctamente, Bienvenido ${Nombre}`
    });
  }
});


app.post("/login", async (req, res) => { 
  const { Correo, Contraseña } = req.body;
  const isUser = await User.loginUsuario(Correo, Contraseña);
  if (typeof isUser === "string") {
    res.status(400).json({
      success: false,
      message: 'Errores de validación',
      icono: 'error',
      titulo: 'Error',
      texto: isUser
    });
  } else {
    res.json({
      success: true,
      message: `El Usuario ha iniciado sesion correctamente, Bienvenido ${isUser.nombre}`,
      icono: 'success',
      titulo: 'Bienvenido',
      texto: `El Usuario ha iniciado sesion correctamente, Bienvenido ${isUser.nombre}`
    });
  }
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Error del servidor" });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
