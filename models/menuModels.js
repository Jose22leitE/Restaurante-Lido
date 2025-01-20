const db = require("../config/firebase");
const Validation = require("./Validation.js");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

class Menu {
  static async newMenu(Nombre, Descripcion, Precio, Imagen, Selection) {
    try {
      let isValid = [];
      isValid.push(Validation.ValidationNombre(Nombre));
      isValid.push(Validation.ValidationDescripcion(Descripcion));
      isValid.push(Validation.ValidationPrecio(Precio));
      isValid.push(Validation.ValidationImagen(Imagen));
      isValid.push(Validation.ValidationMenu(Selection));

      let Errors = [];

      isValid.forEach((Element) => {
        if (Element !== true) {
          Errors.push(Element);
        }
      });

      if (Errors.length > 0) {
        return Errors;
      }

      // Búsqueda del usuario
      const Menu = await db
        .collection("Menu")
        .where("Nombre", "==", Nombre)
        .where("Descripcion", "==", Descripcion)
        .get();
      if (!Menu.empty) {
        return "Lo sentimos este Menu ya esta registrado";
      }

      // Creación del id
      const id = crypto.randomBytes(16).toString("hex");

      // Creación del documento en la base de datos
      await db.collection("Menu").add({
        Nombre: Nombre,
        Descripcion: Descripcion,
        Precio: Precio,
        Imagen: Imagen.name,
        Id: id,
        Tipo: Selection,
      });

      return true;
    } catch (error) {
      return `Error al crear el menú: ${error}`;
    }
  }

  static async mostrarMenu() {
    try {
      // Búsqueda de los menús
      const menu = await db.collection("Menu").get();
      if (menu.empty) {
        return "Menú no encontrado";
      }
      const menuData = [];
      menu.forEach((doc) => {
        menuData.push(doc.data());
      });

      let MostrarMenu = "";
      menuData.forEach((dish) => {
        MostrarMenu += `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="/img_recetas/${dish.Imagen}" class="card-img-top" alt="${dish.Nombre}">
              <div class="card-body">
                <h5 class="card-title">${dish.Nombre}</h5>
                <p class="card-text">
                  Precio: $${dish.Precio}<br>
                  Descripción: ${dish.Descripcion}
                </p>
                <button class="btn btn-danger btn-sm" onclick="deleteDish('${dish.Id}')">Eliminar</button>
                <button class="btn btn-warning btn-sm" onclick="editDish('${dish.Id}')">Modificar</button>
              </div>
            </div>
          </div>
        `;
      });
      return MostrarMenu;
    } catch (error) {
      return `Lo sentimos, error al cargar el menú: ${error.message}`;
    }
  }
  static async mostrarMenuHome() {
    try {
      // Búsqueda de los menús
      const menu = await db.collection("Menu").get();
      if (menu.empty) {
        return "Menú no encontrado";
      }
      const menuData = [];
      menu.forEach((doc) => {
        menuData.push(doc.data());
      });
  
      let Comidas = "";
      let Bebidas = "";
      let Postres = "";
  
      menuData.forEach((dish) => {
        if (dish.Tipo === "Comida") {
          Comidas += `<div class="col-md-6 d-flex align-items-center menu-item food">
                        <img src="/img_recetas/${dish.Imagen}" alt="${dish.Nombre}" class="menu-img rounded-circle me-3">
                        <div>
                          <h5>${dish.Nombre}</h5>
                          <p class="text-muted mb-1">${dish.Descripcion}</p>
                          <span class="fw-bold">$${dish.Precio}</span>
                        </div>
                      </div>`;
        } else if (dish.Tipo === "Postre") {
          Postres += `<div class="col-md-6 d-flex align-items-center menu-item desserts">
                        <img src="/img_recetas/${dish.Imagen}" alt="${dish.Nombre}" class="menu-img rounded-circle me-3">
                        <div>
                          <h5>${dish.Nombre}</h5>
                          <p class="text-muted mb-1">${dish.Descripcion}</p>
                          <span class="fw-bold">$${dish.Precio}</span>
                        </div>
                      </div>`;
        } else if (dish.Tipo === "Bebida") {
          Bebidas += `<div class="col-md-6 d-flex align-items-center menu-item drinks">
                        <img src="/img_recetas/${dish.Imagen}" alt="${dish.Nombre}" class="menu-img rounded-circle me-3">
                        <div>
                          <h5>${dish.Nombre}</h5>
                          <p class="text-muted mb-1">${dish.Descripcion}</p>
                          <span class="fw-bold">$${dish.Precio}</span>
                        </div>
                      </div>`;
        }
      });
  
      return { Comidas: Comidas, Bebidas: Bebidas, Postres: Postres };
    } catch (error) {
      return `Lo sentimos, error al cargar el menú: ${error.message}`;
    }
  }

  static async modMenu(Id = null, Nombre = null, Descripcion = null, Precio = null, Imagen = { name: null }, Selection = null) {
    try {
      let isValid = [];
  
      if (Id == null && Nombre == null && Descripcion == null && Precio == null && Imagen.name == null && Selection == null) {
        return "Todos los campos están vacíos";
      }
  
      // Búsqueda del menú
      let Menu = await db
        .collection("Menu")
        .where("Nombre", "==", Nombre)
        .where("Descripcion", "==", Descripcion)
        .get();
      if (!Menu.empty) {
        return "Lo sentimos, este menú ya está registrado";
      }
  
      if (Nombre) {
        const nombreValid = Validation.ValidationNombre(Nombre);
        if (nombreValid !== true) {
          isValid.push(nombreValid);
        }
      }
      if (Descripcion) {
        const DescripcionValid = Validation.ValidationDescripcion(Descripcion);
        if (DescripcionValid !== true) {
          isValid.push(DescripcionValid);
        }
      }
      if (Precio !== null && !isNaN(Precio)) {
        Precio = parseFloat(Precio);
        const PrecioValid = Validation.ValidationPrecio(Precio);
        if (PrecioValid !== true) {
          isValid.push(PrecioValid);
        }
      }
      if (Imagen && Imagen.name !== null) {
        const ImagenValid = Validation.ValidationImagen(Imagen.name);
        if (ImagenValid !== true) {
          isValid.push(ImagenValid);
        }
      }
      if (Selection !== null) {
        const SelectionValid = Validation.ValidationMenu(Selection);
        if (SelectionValid !== true) {
          isValid.push(SelectionValid);
        }
      }
  
      if (Id === null) {
        return "El id del producto no se encuentra";
      }
  
      let Errors = [];
  
      isValid.forEach((Element) => {
        if (Element !== true) {
          Errors.push(Element);
        }
      });
  
      if (Errors.length > 0) {
        return Errors;
      }
  
      // Búsqueda de menú
      Menu = await db.collection("Menu").where("Id", "==", Id).get();
  
      if (Menu.empty) {
        return "Lo sentimos, este menú no existe";
      }
  
      const menuData = Menu.docs[0].data();
  
      const Mod = {
        Nombre: Nombre || menuData.Nombre,
        Descripcion: Descripcion || menuData.Descripcion,
        Precio: Precio !== null && !isNaN(Precio) ? Precio : menuData.Precio,
        Imagen: Imagen && Imagen.name !== null ? Imagen.name : menuData.Imagen,
        Id: Id || menuData.Id,
        Tipo: Selection || menuData.Selection
      };
  
      // Actualización del documento en la base de datos
      const batch = db.batch();
      Menu.forEach((doc) => {
        batch.update(doc.ref, Mod);
      });
      await batch.commit();
  
      return true;
    } catch (error) {
      if(Imagen.name !== null){
        const imagePath = path.join(
          __dirname,
          "../public/img_recetas",
          Imagen.name
        );
        this.deleteImage(imagePath);
      }
      return `Error al modificar el menú: ${error.message}`;
    }
  }
  
  // Función para borrar una imagen
  static deleteImage(imagePath) {
    fs.unlink(imagePath, (err) => {
      if (err) {
        return `Error al borrar la imagen: ${err.message}`;
      }
      return true
    });
  }
  
  static buscarImagen(nombreImagen) {
    const rutaCarpeta = path.join(__dirname, '../public', 'img_recetas');
    const rutaImagen = path.join(rutaCarpeta, nombreImagen);
  
    fs.access(rutaImagen, fs.constants.F_OK, (err) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  }

  static async delMenu(Id) {
    try {
      const Menu = await db.collection("Menu").where("Id", "==", Id).get();
      if (Menu.empty) {
        return "Lo sentimos, este menú no existe";
      }
    
      let isDelete;
      
      const menuData = Menu.docs[0].data();
      
      if (this.buscarImagen(menuData.Imagen)) {
        const imagePath = path.join(__dirname, "../public/img_recetas", menuData.Imagen);
        isDelete = this.deleteImage(imagePath);
      } else {
        isDelete = true;
      }
  
      if (isDelete !== true) {
        return isDelete;
      }
  
      const batch = db.batch();
      Menu.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      return true;
    } catch (error) {
      console.error("Error al crear el documento:", error);
      return `Error al crear el documento: ${error.message}`;
    }
  }
  
}

module.exports = Menu;
