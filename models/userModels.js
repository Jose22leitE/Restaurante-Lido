const db = require("../config/firebase");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mainModels = require("./mainModels");

class User {
  static async registroUsuario(name, Contraseña, Telefono, correo, Edad) {
    try {
      // Validación de datos
      const isValid = mainModels.Validation(1, { name, Contraseña, Telefono, correo, Edad });
      if (isValid !== true) {
        return isValid;
      }

      // Búsqueda del usuario
      let user = await db.collection("Usuario").where("email", "==", correo).get();
      if (!user.empty) {
        return "Usuario ya registrado";
      }

      // Búsqueda del usuario
      user = await db.collection("Usuario").where("telefono", "==", Telefono).get();
      if (!user.empty) {
        return "Usuario ya registrado";
      }

      // Creación del id
      const id = crypto.randomBytes(16).toString("hex");

      // Encriptación de la contraseña
      Contraseña = await bcrypt.hash(Contraseña, 8);

      // Creación del documento
      await db.collection("Usuario").doc(id).set({
        nombre: name,
        email: correo,
        contraseña: Contraseña,
        telefono: Telefono,
        edad: Edad,
        rol: "cliente",
      });
      
      return true;
    } catch (error) {
      return "Error al crear el documento:", error;
    }
  }

  static async loginUsuario(correo, Contraseña) {
    try {
      // Validación de datos
      const isValid = mainModels.Validation(2, { correo, Contraseña });
      if (isValid !== true) {
        return isValid;
      }


      // Búsqueda del usuario
      const user = await db.collection("Usuario").where("email", "==", correo).get();
      if (user.empty) {
        return "Usuario no encontrado";
      }


      // Verificación de la contraseña
      const userData = user.docs[0].data();
      const isMatch = await bcrypt.compareSync(Contraseña, userData.contraseña);
      if (!isMatch) {
        return true;
      }

      const Usuario = {
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        edad: userData.edad,
        rol: userData.rol,
      }
      return Usuario;
    } catch (error) {
      return "Error al buscar el usuario:", error;
    }
  }
}

module.exports = User;
