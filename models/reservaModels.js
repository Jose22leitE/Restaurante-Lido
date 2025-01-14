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

      const userReservations = await db
        .collection("Reserva")
        .where("ID_User", "==", ID)
        .get();


      if (userReservations.size > 3) {
        return "El usuario ya tiene la cantidad máxima de reservaciones (3)";
      }

      // Creación del id
      const id = crypto.randomBytes(16).toString("hex");

      // Creación del documento
      await db.collection("Reserva").add({
        Id: id,
        ID_User: ID,
        Fecha: Fecha,
        Hora: Hora,
        Personas: Personas,
        Status: "En Espera"
      });

      return true;
    } catch (error) {
      return `Error al crear el documento: ${error.message}`;
    }
  }

  static async mostrarReservasUser(ID) {
    try {
      // Búsqueda de las reservas
      const reservas = await db.collection("Reserva").where("ID_User", "==", ID).get();
      if (reservas.empty) {
        return "Reservas no encontradas";
      }
      const reservasData = [];
      reservas.forEach((doc) => {
        reservasData.push(doc.data());
      });

      let reservaHTML = "";
      let i = 0;
      reservasData.forEach((reserva) => {
        i++;
        reservaHTML += `
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">#${i}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Hora: ${reserva.Hora}</h6>
              <h6 class="card-subtitle mb-2 text-muted">Fecha: ${reserva.Fecha}</h6>
              <p class="card-text">Status: ${reserva.Status}</p>
            </div>
          </div>
        `;
      });

      return reservaHTML;
    } catch (error) {
      return `Lo sentimos, error al cargar las reservas: ${error.message}`;
    }
  }
  static async mostrarReservasAdmin() {
    try {
      // Búsqueda de las reservas
      const reservas = await db.collection("Reserva").get();
      if (reservas.empty) {
        return "Reservas no encontradas";
      }
      const reservasData = [];
      reservas.forEach((doc) => {
        reservasData.push(doc.data());
      });

      let reservaHTML = "";
      let i = 0;
      reservasData.forEach((reserva) => {
        i++;
        reservaHTML += `
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">#${i}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Hora: ${reserva.Hora}</h6>
              <h6 class="card-subtitle mb-2 text-muted">Fecha: ${reserva.Fecha}</h6>
              <p class="card-text">Status: ${reserva.Status}</p>
              <button class="btn btn-primary">Aceptar</button>
              <button class="btn btn-secondary">Denegada</button>
            </div>
          </div>
        `;
      });

      return reservaHTML;
    } catch (error) {
      return `Lo sentimos, error al cargar las reservas: ${error.message}`;
    }
  }
  static async modificarReserva(reservaId, nuevosDatos) {
    try {
      const reservaRef = db.collection('Reserva').doc(reservaId);
      const reservaDoc = await reservaRef.get();
      if (!reservaDoc.exists) { return 'Reserva no encontrada'; }
      await reservaRef.update(nuevosDatos);
      return true;
    } catch (error) {
      return `Error al actualizar la reserva: ${error.message}`;
    }
  }
}

module.exports = Reserva;
