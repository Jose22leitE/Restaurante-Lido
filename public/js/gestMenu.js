let menu = [];

document.getElementById("addDishForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("Nombre", document.getElementById("dishName").value);
  formData.append(
    "Descripcion",
    document.getElementById("dishDescription").value
  );
  formData.append(
    "Precio",
    parseFloat(document.getElementById("dishPrice").value)
  );
  formData.append("Imagen", document.getElementById("dishImage").files[0]);

  const plato = {
    Nombre: document.getElementById("dishName").value,
    Descripcion: document.getElementById("dishDescription").value,
    Precio: parseFloat(document.getElementById("dishPrice").value),
  };

  fetch("/gestMenuA", {
    method: "POST",
    body: formData,
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
          plato.Imagen = res.Imagen;
          plato.Id = res.Id;
          menu.push(plato);
          renderMenu();
        }
      });
    })
    .catch((error) => console.error("Error:", error));
});

// Eliminar un plato
function deleteDish(id) {
  fetch("/gestMenuD", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Id: id }),
  }).then((res) => res.json())
    .then((res) => {
      Swal.fire({
        title: res.titulo,
        text: res.texto,
        icon: res.icono,
        confirmButtonText: "Aceptar",
      });
    })
    .catch((error) => console.error("Error:", error));
}
