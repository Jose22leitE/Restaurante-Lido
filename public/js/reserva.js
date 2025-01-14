// Selección del formulario
const form = document.getElementById("reservation-form");

// Evento al enviar el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Previene el envío por defecto

  // Obtener datos del formulario
  const Nombre = document.getElementById("name").value.trim();
  const Correo = document.getElementById("email").value.trim();
  const Telefono = document.getElementById("phone").value.trim();
  const Fecha = document.getElementById("date").value;
  const Hora = document.getElementById("time").value;
  const Personas = document.getElementById("guests").value;

  fetch("/reserva", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Nombre,
      Correo,
      Telefono,
      Fecha,
      Hora,
      Personas,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      Swal.fire({
        title: res.titulo,
        text: res.texto,
        icon: res.icono,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Verifica si el botón de confirmación fue presionado
          window.location.href = "prueba"; // Redirige a la página 'prueba'
        }
      });
    })
    .catch((error) => console.error("Error:", error));
});
