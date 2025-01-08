const db = require("../config/firebase");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mainModels = require("./mainModels");

class User {
  static async registroUsuario(name, Contraseña, Telefono, correo, Edad) {
    try {
      // Validación de datos
      const isValid = mainModels.Validation(1, {
        name,
        Contraseña,
        Telefono,
        correo,
        Edad,
      });
      if (isValid !== true) {
        return isValid;
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
      console.log("Documento creado exitosamente!");
    } catch (error) {
      console.error("Error al crear el documento:", error);
    }
  }

  static async buscarUsuarioPorCorreo(correo) {
    try {
      const querySnapshot = await db.collection("Usuario").where("email", "==", correo).get();
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        console.log("Usuario encontrado:", userDoc.data());
        return userDoc.data();
      } else {
        console.log("No se encontró el usuario.");
        return null;
      }
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      throw error;
    }
  }
}


module.exports = User;
