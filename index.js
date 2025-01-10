const express = require("express");
const path = require("path");
const User = require("./models/userModels.js");

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Configuración del motor de plantillas y vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configura la carpeta 'view/css' para servir archivos estáticos
app.use("/css", express.static(path.join(__dirname, "views/css")));

// Middleware para autenticación y roles
const isAuthenticated = (req, res, next) => {
  if (req.query.auth === "true") {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.query.admin === "true") {
    return next();
  }
  res.status(403).render("403", { title: "Acceso denegado" });
};

// Rutas públicas
app.get("/:view?", (req, res) => {
  const view = req.params.view || "home";
  const publicViews = ["home", "contacto", "menu", "reserva"];

  if (publicViews.includes(view)) {
    res.render(view, { title: view.charAt(0).toUpperCase() + view.slice(1) });
  } else {
    res.status(404).render("404", { title: "Página no encontrada" });
  }
});

app.post("/register", async (req, res) => {
  const { name, Contraseña, Telefono, correo, Edad } = req.body;
  const isRegister = await User.registroUsuario(
    name,
    Contraseña,
    Telefono,
    correo,
    Edad
  );
  if (isRegister !== true) {
    res.status(400).send(`Errores de validación:\n${isRegister}`);
  } else {
    res.send("Usuario registrado exitosamente");
  }
});

// Rutas protegidas (requieren autenticación)
app.get("/dashboard", isAuthenticated, isAdmin, (req, res) => {
  res.render("dashboard", { title: "Panel de Administración" });
});

app.get("/gestion-menu", isAuthenticated, isAdmin, (req, res) => {
  res.render("gestion-menu", { title: "Gestión de Menú" });
});

app.get("/gestion-reservas", isAuthenticated, isAdmin, (req, res) => {
  res.render("gestion-reservas", { title: "Gestión de Reservas" });
});

// Página de inicio de sesión
app.get("/login", (req, res) => {
  res.render("login", { title: "Inicio de sesión" });
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

app.post("/login", async (req, res) => {
  const { correo, Contraseña } = req.body;
  const isUser = await User.loginUsuario(correo, Contraseña);
  if (typeof isUser === "string") {
    res.status(400).send(`Errores de validación:\n${isUser}`);
  } else {
    res.send(`Sesión iniciada correctamente, Bienvenido ${isUser.nombre}`);
  }
});
