const db = require("../config/firebase");
const Validation = require("./Validation.js");
const crypto = require("crypto");

class Reserva {
  static async crearReserva(Fecha, Hora, Personas, ID) {
    try {
      // Validación de datos
      let isValid = [];
      isValid.push(Validation.ValidationFecha(Fecha));
      isValid.push(Validation.ValidationHora(Hora));
      isValid.push(Validation.ValidationPersonas(Personas));
  
      let Errors = [];
  
      isValid.forEach((Element) => {
        if (Element !== true) {
          Errors.push(Element);
        }
      });
  
      if (Errors.length > 0) {
        return Errors;
      }
  
      // Creación del id
      const id = crypto.randomBytes(16).toString("hex");
      console.log(ID);
      // Creación del documento
      await db.collection("Reserva").add({
        Id: id,
        ID_User: ID,
        Fecha: Fecha,
        Hora: Hora,
        Personas: Personas,
      });
  
      return true;
    } catch (error) {
      return `Error al crear el documento: ${error.message}`;
    }
  }
  
}

module.exports = Reserva;
