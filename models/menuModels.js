const db = require("../config/firebase");
const Validation = require("./Validation.js");

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

      // Creación del documento en la base de datos
      await db.collection("Menu").add({
        Nombre: Nombre,
        Descripcion: Descripcion,
        Precio: Precio,
        Imagen: Imagen.name,
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
}

module.exports = Menu;
