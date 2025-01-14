const db = require("../config/firebase");
const Validation = require("./Validation.js");
const crypto = require("crypto");

class Menu {
  static async newMenu(Nombre, Descripcion, Precio, Imagen) {
    try {
      let isValid = [];
      isValid.push(Validation.ValidationNombre(Nombre));
      isValid.push(Validation.ValidationDescripcion(Descripcion));
      isValid.push(Validation.ValidationPrecio(Precio));
      isValid.push(Validation.ValidationImagen(Imagen));
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
      });

      return true;
    } catch (error) {
      return `Error al crear el menú: ${error}`;
    }
  }

  static async Menu() {
    try {
      // Búsqueda del usuario
      const menu = await db.collection("Menu").get();
      if (menu.empty) {
        return "Menú no encontrado";
      }
      const menuData = menu.docs.data();
      return menuData;
    } catch (error) {
      return "Lo Sentimos error al cargar el menu";
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

  static async delMenu(Id){
    try {
      // Búsqueda del menú
      const Menu = await db.collection("Menu").where("Id", "==", Id).get();
      if (Menu.empty) {
        return "Lo sentimos, este menú no existe";
      }

      // Eliminación del documento en la base de datos
      const batch = db.batch();
      Menu.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return true;
    } catch (error) {
      return `Error al eliminar el menú: ${error}`;
    }
  }
}

module.exports = Menu;
