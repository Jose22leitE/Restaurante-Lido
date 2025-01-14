document.addEventListener("DOMContentLoaded", () => {
  // Selección del formulario
  const form = document.getElementById("reservation-form");

  // Evento al enviar el formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Previene el envío por defecto

    // Obtener datos del formulario
    const Fecha = document.getElementById("date").value;
    const Hora = document.getElementById("time").value;
    const Personas = parseInt(document.getElementById("guests").value, 10);

    fetch("/reserva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Fecha,
        Hora,
        Personas
      })
    })
      .then((res) => res.json())
      .then((res) => {
        Swal.fire({
          title: res.titulo,
          text: res.texto,
          icon: res.icono,
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed && res.success === "success") {
            // Verifica si el botón de confirmación fue presionado y la reserva fue exitosa
            window.location.href = "home";
          }
        });
      })
      .catch((error) => console.error("Error:", error));
  });
});
