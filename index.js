const express = require("express");
const path = require("path");
const User = require("./models/userModels.js");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('./config/config.js');
const cookieParser = require("cookie-parser");

// Crear la aplicación express
const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(cookieParser());

// Configuración del motor de plantillas y vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configura la carpeta 'view/css' para servir archivos estáticos
app.use("/css", express.static(path.join(__dirname, "public/css")));

// Configura la carpeta 'view/js' para servir archivos estáticos
app.use("/js", express.static(path.join(__dirname, "public/js")));

// Configura la carpeta 'view/img' para servir archivos estáticos
app.use("/img", express.static(path.join(__dirname, "public/img")));

// Rutas para las vistas
app.get("/home", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/contacto", (req, res) => {
  res.render("contacto", { title: "Contacto" });
});

app.get("/menu", (req, res) => {
  res.render("menu", { title: "Menu" });
});

app.get("/reserva", (req, res) => {
  res.render("reserva", { title: "Reserva" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/prueba", (req, res) => {
  const token = req.cookies['token_access'];
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const data = jwt.verify(token, SECRET_KEY);
    console.log(data);
    res.render("prueba", { title: "Prueba", data});
  } catch (error) {
    res.status(403).redirect("/login");
  }
});

app.get("/", (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get("*", (req, res) => {
  res.status(404).render("404", { title: "Página no encontrada" });
});



// Rutas protegidas
app.post("/register", async (req, res) => {
  const { Nombre, Contraseña, Telefono, Correo } = req.body;
  const isRegister = await User.registroUsuario(Nombre, Contraseña, Telefono, Correo);
  if (isRegister !== true) {
    res.status(400).json({
      success: false,
      message: "Errores de validación",
      icono: "error",
      titulo: "Error",
      texto: isRegister,
    });
  } else {
    res.json({
      success: true,
      message: `Usuario registrado correctamente, Bienvenido ${Nombre}`,
      icono: "success",
      titulo: "Bienvenido",
      texto: `Usuario registrado correctamente, Bienvenido ${Nombre}`,
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { Correo, Contraseña } = req.body;
    const isUser = await User.loginUsuario(Correo, Contraseña);

    if (typeof isUser === "string") {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        icono: 'error',
        titulo: 'Error',
        texto: isUser
      });
    }

    const token = jwt.sign({ id: isUser.id, nombre: isUser.nombre }, SECRET_KEY, { expiresIn: '1h' });

    res
      .cookie("token_access", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60
      })
      .json({
        success: true,
        message: `El Usuario ha iniciado sesión correctamente, Bienvenido ${isUser.nombre}`,
        icono: "success",
        titulo: "Bienvenido",
        texto: `El Usuario ha iniciado sesión correctamente, Bienvenido ${isUser.nombre}`,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      icono: "error",
      titulo: "Error",
      texto: error.message,
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
