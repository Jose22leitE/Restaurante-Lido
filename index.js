const express = require("express");
const path = require("path");
const User = require("./models/userModels.js");
const Reserva = require("./models/reservaModels.js");
const Menu = require("./models/menuModels.js");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, DIRECTORIO } = require("./config/config.js");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { title } = require("process");

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRECTORIO);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage });

// Crear la aplicación express
const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use(
  "/img_recetas",
  express.static(path.join(__dirname, "public/img_recetas"))
);

// Middleware de sesiones
app.use((req, res, next) => {
  const token = req.cookies["token_access"];
  let data = null;

  req.session = req.session || {};

  if (!token) {
    return next();
  }

  try {
    data = jwt.verify(token, SECRET_KEY);
    req.session.user = data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.render("login", { title: "login" });
  }
  next();
});

// Rutas Admin
const rutesAdmin = ["gestmenu","gestreserva"];
// Rutas Cliente
const rutesClientes = ["perfil"];
// Rutas Publicas
const rutesPublicas = ["home", "login", "logout", "menu", "reserva", "contacto", "politicaPriv", "acerca"];


// Rutas GET
app.get("/:view?", async (req, res) => {
  let view = req.params.view || "home";
  const data = req.session.user || null;

  if (
    !rutesAdmin.includes(view) &&
    !rutesPublicas.includes(view) &&
    !rutesClientes.includes(view)
  ) {
    return res.status(404).render("404", { title: "Página no encontrada" });
  }

  if (view === "login") {
    if (data == null) {
      return res.render("login", { title: "Inicio de sesión" });
    } else {
      return res.render("home", { title: "Home" });
    }
  }

  if (view === "logout") {
    res.clearCookie("token_access");
    return res.render("logout",{title:"Cerra Sesion"});
  }

  const menuHtmlhome = await Menu.mostrarMenuHome();
  const menuHtmlgest = await Menu.mostrarMenu();
  const reservasHtmlUser = await Reserva.mostrarReservasUser(data ? data.Id : null);
  const reservasHtmlAdmin = await Reserva.mostrarReservasAdmin();

  if (rutesPublicas.includes(view)) {
    return res.render(view, { title: view, Menu: menuHtmlhome, user: data, menu: menuHtmlgest, reservas: reservasHtmlUser });
  } else if (rutesAdmin.includes(view)) {
    if (data && data.Rol === "admin") {
      return res.render(view, { title: view, Menu: menuHtmlhome, user: data, menu: menuHtmlgest, reservas: reservasHtmlAdmin });
    } else {
      return res.render("login", { title: "Inicio de sesión" });
    }
  } else if (rutesClientes.includes(view)) {
    if (data && data.Rol === "cliente") {
      return res.render(view, { title: view, Menu: menuHtmlhome, user: data, menu: menuHtmlgest, reservas: reservasHtmlUser });
    } else {
      return res.render("login", { title: "Inicio de sesión" });
    }
  } else {
    return res.status(404).render("404", { title: "Página no encontrada" });
  }
});

// Rutas POST
app.post("/register", async (req, res) => {
  const { Nombre, Contraseña, Telefono, Correo } = req.body;
  const isRegister = await User.registroUsuario(
    Nombre,
    Contraseña,
    Telefono,
    Correo
  );
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
      message: `Usuario registrado correctamente, por favor inicie sesion`,
      icono: "success",
      titulo: "Bienvenido",
      texto: `Usuario registrado correctamente, por favor inicie sesion`,
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
        message: "Errores de validación",
        icono: "error",
        titulo: "Error",
        texto: isUser,
      });
    }
    const token = jwt.sign(
      { Id: isUser.Id, Nombre: isUser.Nombre, Rol: isUser.Rol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .cookie("token_access", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json({
        success: true,
        message: `El Usuario ha iniciado sesión correctamente, Bienvenido ${isUser.Nombre}`,
        icono: "success",
        titulo: "Bienvenido",
        texto: `El Usuario ha iniciado sesión correctamente, Bienvenido ${isUser.Nombre}`,
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

app.post("/reserva", async (req, res) => {
  const { Fecha, Hora, Personas } = req.body;
  const data = req.session.user || null;

  if (!data) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
      icono: "error",
      titulo: "Error",
      texto: "Debe iniciar sesión para realizar una reserva",
    });
  }

  const ID = data.Id;
  const isReserva = await Reserva.crearReserva(Fecha, Hora, Personas , ID);

  if (isReserva !== true) {
    res.status(400).json({
      success: false,
      message: "Errores de validación",
      icono: "error",
      titulo: "Error",
      texto: isReserva,
    });
  } else {
    res.json({
      success: "success",
      message: "Reserva realizada correctamente",
      icono: "success",
      titulo: "Enhorabuena",
      texto: "Reserva realizada correctamente, lo esperamos en la fecha y hora indicada",
    });
  }
});

app.post("/reservaA", async (req, res) => {
  const {Id,Dato} = req.body;
  console.log(Id,Dato);

  const isReserva = await Reserva.modificarReserva(Id,Dato);

  if (isReserva !== true) {
    res.status(400).json({
      success: false,
      message: "Errores de validación",
      icono: "error",
      titulo: "Error",
      texto: isReserva,
    });
  } else {
    res.json({
      success: "success",
      message: `Reserva ha ${Dato} correctamente.`,
      icono: "success",
      titulo: "Enhorabuena",
      texto: `Reserva ha ${Dato} correctamente.`,
    });
  }
});

app.post("/gestMenuA", upload.single("Imagen"), async (req, res) => {
  const { Nombre, Descripcion, Precio,Selection } = req.body;
  const Imagen = {
    name: req.file.filename,
    size: req.file.size,
    extension: path.extname(req.file.originalname),
  };
  const isMenu = await Menu.newMenu(Nombre, Descripcion, Precio, Imagen, Selection);
  if (isMenu !== true) {
    res.status(400).json({
      success: false,
      message: "Errores de validación",
      icono: "error",
      titulo: "Error",
      texto: isMenu,
    });
  } else {
    res.json({
      success: "success",
      message: "Menu registrado",
      icono: "success",
      titulo: "Enhorabuena",
      texto: "Menu registrado correctamente"
    });
  }
});
app.post("/gestMenuM", upload.single("Imagen"), async (req, res) => {
  const { Id, Nombre, Descripcion, Precio, Selection } = req.body;
  let Imagen = null;

  if (req.file) {
    Imagen = {
      name: req.file.filename,
      size: req.file.size,
      extension: path.extname(req.file.originalname),
    };
  }

  // Verificar si no se ha ingresado ningún campo
  if (!Id && !Nombre && !Descripcion && !Precio && !Selection && !Imagen) {
    return res.status(400).json({
      success: false,
      message: "No hay ningún campo ingresado",
      icono: "error",
      titulo: "Error",
      texto: "No hay ningún campo ingresado",
    });
  }

  const isMenu = await Menu.modMenu(Id, Nombre, Descripcion, Precio, Imagen, Selection);

  if (isMenu !== true) {
    res.status(400).json({
      success: false,
      message: "Errores de validación",
      icono: "error",
      titulo: "Error",
      texto: isMenu,
    });
  } else {
    res.json({
      success: "success",
      message: "Menú modificado",
      icono: "success",
      titulo: "Excelente",
      texto: "Menú modificado correctamente",
    });
  }
});


app.post("/gestMenuD", async (req, res) => {
  const {Id} = req.body;

  const isMenu = await Menu.delMenu(Id);
  console.log(isMenu);
  if (isMenu !== true) {
    res.status(400).json({
      success: false,
      message: "Errores de validación",
      icono: "error",
      titulo: "Error",
      texto: isMenu,
    });
  } else {
    res.json({
      success: "success",
      message: "Menu Eliminado",
      icono: "success",
      titulo: "Excelente",
      texto: "Menu eliminado correctamente"
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

Reserva.borrarReservasVencidas();