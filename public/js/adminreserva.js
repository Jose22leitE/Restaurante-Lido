function Aceptar(button) {
  const reservaId = button.getAttribute("data-id");
  EnviarInfo(reservaId, "Aceptada");
}

function Denegar(button) {
  const reservaId = button.getAttribute("data-id");
  EnviarInfo(reservaId, "Denegada");
}

function EnviarInfo(Id, Dato) {
  fetch("/reservaA", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Id,
      Dato,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      Swal.fire({
        title: res.titulo,
        text: res.texto,
        icon: res.icono,
        confirmButtonText: "Aceptar",
      })
    })
    .catch((error) => console.error("Error:", error));
}
