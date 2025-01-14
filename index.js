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

//Congfiguración de multer
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
//middleware de sesiones
app.use((req, res, next) => {
  const token = req.cookies["token_access"];
  let data = null;

  req.session = { user: null };

  if (!token) {
    return next();
  }

  try {
    data = jwt.verify(token, SECRET_KEY);
    console.log(data.Rol);
    req.session.user = data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.render("login", { title: "login" });
  }
  next();
});

// Rutas Admin
const rutesAdmin = ["gestmenu"];
// Rutas Cliente
const rutesClientes = ["gfdakj"];
// Rutas Publicas
const rutesPublicas = ["home", "login", "logout", "menu", "Reserva"];

// Rutas GET
app.get("/:view?", (req, res) => {
  let view = req.params.view || "home"; // Establecer "home" como valor predeterminado
  const data = req.session.user || null;

  if (
    !rutesAdmin.includes(view) &&
    !rutesPublicas.includes(view) &&
    !rutesClientes.includes(view)
  ) {
    return res.status(404).render("404", { title: "Página no encontrada" });
  }

  if (rutesPublicas.includes(view)) {
    res.render(view, { title: view });
  } else if (rutesAdmin.includes(view)) {
    if (data && data.rol === "admin") {
      res.render(view, { title: view });
    } else {
      return res.render("login", {
        title: "Inicio de sesión",
      });
    }
  } else if (rutesClientes.includes(view)) {
    if (data && data.rol === "cliente") {
      res.render(view, { title: view });
    } else {
      return res.render("login", {
        title: "Inicio de sesión",
      });
    }
  } else {
    res.status(404).render("404", { title: "Página no encontrada" });
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
        secure: true,
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
  const { Nombre, Correo, Telefono, Fecha, Hora, Personas } = req.body;
  const isReserva = await Reserva.crearReserva(
    Nombre,
    Correo,
    Telefono,
    Fecha,
    Hora,
    Personas
  );
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
      message: "Errores de validación",
      icono: "success",
      titulo: "Enhorabuena",
      texto:
        "Reserva realizada correctamente, lo esperamos en la fecha y hora indicada",
    });
  }
});

app.post("/gestMenuA", upload.single("Imagen"), async (req, res) => {
  const { Nombre, Descripcion, Precio } = req.body;
  const Imagen = {
    name: req.file.filename,
    size: req.file.size,
    extension: path.extname(req.file.originalname),
  };
  const isMenu = await Menu.newMenu(Nombre, Descripcion, Precio, Imagen);
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
      texto: "Menu registrado correctamente",
      Imagen: req.file.filename,
      id: "123",
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
