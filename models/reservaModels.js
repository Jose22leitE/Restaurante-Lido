const db = require("../config/firebase");
const Validation = require("./Validation.js");

class Reserva {
  static async crearReserva(Nombre,Correo,Telefono,Fecha,Hora,Personas) {
    try {
      // Validación de datos
      let isValid = [];
      isValid.push(Validation.ValidationNombre(Nombre));
      isValid.push(Validation.ValidationTelefono(Telefono));
      isValid.push(Validation.ValidationCorreo(Correo));
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

      // Creación del documento
      await db.collection("Reserva").add({
        Nombre: Nombre,
        Telefono: Telefono,
        Correo: Correo,
        Fecha: Fecha,
        Hora: Hora,
        Personas: Personas,
      });

      return true;
    } catch (error) {
      return `Error al crear el documento: ${error}`;
    }
  }
}

module.exports = Reserva;
