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
  
  

  static async modMenu(Id, Nombre, Descripcion, Precio, Imagen) {
    try {
      let Mod = {};

      if (Nombre !== "") {
        Mod.Nombre = Nombre;
      }
      if (Descripcion && Descripcion.trim() !== "") {
        Mod.Descripcion = Descripcion;
      }
      if (Precio !== "") {
        Mod.Precio = Precio;
      }
      if (Imagen.name) {
        Mod.Imagen = Imagen.name;
      }

      // Verificar si hay campos para actualizar
      if (Object.keys(Mod).length === 0) {
        return "No hay campos para actualizar";
      }

      // Búsqueda del menú
      const Menu = await db.collection("Menu").where("Id", "==", Id).get();

      if (Menu.empty) {
        return "Lo sentimos, este menú no existe";
      }

      // Actualización del documento en la base de datos
      const batch = db.batch();
      Menu.forEach((doc) => {
        batch.update(doc.ref, Mod);
      });
      await batch.commit();

      return true;
    } catch (error) {
      return `Error al modificar el menú: ${error}`;
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

  static async delMenu(Id) {
    try {
      const Menu = await db.collection("Menu").where("Id", "==", Id).get();
      if (Menu.empty) {
        return "Lo sentimos, este menú no existe";
      }
      const menuData = Menu.docs[0].data();
      const imagePath = path.join(
        __dirname,
        "../public/img_recetas",
        menuData.Imagen
      );
      const isDelete =this.deleteImage(imagePath);
      
      if(isDelete != true){
        return isDelete
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
