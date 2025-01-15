const { isValid } = require("zod");
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
        Status: "En Espera",
      });

      return true;
    } catch (error) {
      return `Error al crear el documento: ${error.message}`;
    }
  }

  static async mostrarReservasUser(ID) {
    try {
      // Búsqueda de las reservas
      const reservas = await db
        .collection("Reserva")
        .where("ID_User", "==", ID)
        .get();
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
        if (reserva.Status == "En Espera") {
          i++;
          reservaHTML += `
                          <div class="card" style="width: 18rem;">
                            <div class="card-body">
                              <h5 class="card-title">#${i}</h5>
                              <h6 class="card-subtitle mb-2 text-muted">Hora: ${reserva.Hora}</h6>
                              <h6 class="card-subtitle mb-2 text-muted">Fecha: ${reserva.Fecha}</h6>
                              <p class="card-text">Status: ${reserva.Status}</p>
                              <button class="btn btn-primary" data-id="${reserva.Id}" onclick="Aceptar(this)">Aceptar</button>
                              <button class="btn btn-secondary" data-id="${reserva.Id}" onclick="Denegar(this)">Denegada</button>
                            </div>
                          </div>
                        `;
        }
      });

      if (reservaHTML == "") {
        reservaHTML =
          "<h1>No se han encontrado reservas en estado: En espera</h1>";
      }

      return reservaHTML;
    } catch (error) {
      return `Lo sentimos, error al cargar las reservas: ${error.message}`;
    }
  }

  static async modificarReserva(idInterno, nuevosDatos) {
    try {
      // Realizar una consulta para obtener el documento con el ID interno
      const reservaQuery = await db
        .collection("Reserva")
        .where("Id", "==", idInterno)
        .get();
      console.log(idInterno, nuevosDatos);
      // Verificar si la consulta devuelve algún documento
      if (reservaQuery.empty) {
        return "Reserva no encontrada";
      }

      let isValid = Validation.ValidationStatus(nuevosDatos);
      if (isValid != true) return isValid;
      const Actualizar = { Status: nuevosDatos };

      // Obtener el ID del documento generado por Firestore
      const reservaDocId = reservaQuery.docs[0].id;

      // Obtener la referencia del documento utilizando el ID generado por Firestore
      const reservaRef = db.collection("Reserva").doc(reservaDocId);

      // Actualizar los datos de la reserva
      await reservaRef.update(Actualizar);

      return true;
    } catch (error) {
      return `Error al actualizar la reserva: ${error.message}`;
    }
  }

  static async borrarReservasVencidas() {
    // Obtener la fecha actual
    const hoy = new Date();
  
    // Crear una nueva fecha para ayer
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
  
    // Formatear la fecha de ayer
    const dia = ayer.getDate().toString().padStart(2, '0');
    const mes = (ayer.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son indexados desde 0
    const anio = ayer.getFullYear();
  
    const FechaVencida = `${anio}-${mes}-${dia}`;
  
    try {
      const reserva = await db.collection("Reserva").where("Fecha", "==", FechaVencida).get();
  
      if (reserva.empty) {
        console.log("No hay reservas vencidas para borrar.");
        return "No hay reservas vencidas para borrar.";
      }
  
      const batch = db.batch();
      reserva.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("Reservas Vencidas Eliminadas");
    } catch (error) {
      console.error("Error al borrar el documento:", error);
    }
  }
  
}

module.exports = Reserva;
