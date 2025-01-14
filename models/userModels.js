const db = require("../config/firebase");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Validation = require("./Validation.js");

class User {
  static async registroUsuario(Nombre, Contraseña, Telefono, Correo) {
    try {
      // Validación de datos

      let isValid = [];
      isValid.push(Validation.ValidationNombre(Nombre));
      isValid.push(Validation.ValidationTelefono(Telefono));
      isValid.push(Validation.ValidationCorreo(Correo));
      isValid.push(Validation.ValidationContraseña(Contraseña));

      let Errors = [];

      isValid.forEach((Element) => {
        if (Element != true) {
          Errors.push(Element);
        }
      });

      if (Errors.length > 0) {
        return Errors;
      }

      // Búsqueda del usuario
      let user = await db
        .collection("Usuario")
        .where("Correo", "==", Correo)
        .get();
      if (!user.empty) {
        return "Usuario ya registrado";
      }

      // Búsqueda del usuario
      user = await db
        .collection("Usuario")
        .where("Telefono", "==", Telefono)
        .get();
      if (!user.empty) {
        return "Usuario ya registrado";
      }

      // Creación del id
      const id = crypto.randomBytes(16).toString("hex");

      // Encriptación de la contraseña
      Contraseña = await bcrypt.hash(Contraseña, 8);

      // Creación del documento
      await db.collection("Usuario").doc(id).set({
        Nombre: Nombre,
        Correo: Correo,
        contraseña: Contraseña,
        Telefono: Telefono,
        Rol: "admin",
        Id: id
      });

      return true;
    } catch (error) {
      return `Error al crear el documento: ${error}`;
    }
  }

  static async loginUsuario(Correo, Contraseña) {
    try {
      // Validación de datos
      let isValid = [];

      isValid.push(Validation.ValidationCorreo(Correo));
      isValid.push(Validation.ValidationContraseña(Contraseña));

      let Errors = [];

      isValid.forEach((Element) => {
        if (Element != true) {
          Errors.push(Element);
        }
      });

      if (Errors.length > 0) {
        return Errors;
      }

      // Búsqueda del usuario
      const user = await db
        .collection("Usuario")
        .where("Correo", "==", Correo)
        .get();
      if (user.empty) {
        return "Usuario no encontrado";
      }

      // Verificación de la contraseña
      const userData = user.docs[0].data();
      const isMatch = await bcrypt.compareSync(Contraseña, userData.contraseña);
      if (!isMatch) {
        return "Usuario o Contraseña Invalida";
      }

      const Usuario = {
        Nombre: userData.Nombre,
        Correo: userData.Correo,
        Telefono: userData.Telefono,
        Rol: userData.Rol,
      };
      console.log(Usuario);
      return Usuario;
    } catch (error) {
      return "Error al buscar el usuario:", error;
    }
  }
}

module.exports = User;
