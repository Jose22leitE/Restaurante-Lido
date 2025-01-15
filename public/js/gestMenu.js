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
  formData.append("Selection", document.getElementById("Selection").value)

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

function editDish(id) {
  const targeta = document.querySelector(".target-mod-menu");
  targeta.innerHTML = `
    <div class="card p-4 mb-4">
      <h3 class="text-center">Modificar Plato</h3>
      <form id="editDishForm">
        <input type="hidden" id="dishId" value="${id}">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="dishName" class="form-label">Nombre del Plato</label>
            <input type="text" class="form-control" id="dishName" placeholder="Colocar el nombre del plato" required>
          </div>
          <div class="col-md-6">
            <label for="dishDescription" class="form-label">Descripción</label>
            <input type="text" class="form-control" id="dishDescription" placeholder="Colocar la descripción del plato" required>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="dishPrice" class="form-label">Precio</label>
            <input type="number" class="form-control" id="dishPrice" placeholder="Colocar el precio del plato" step="0.01" required>
          </div>
          <div class="col-md-6">
            <label for="dishImage" class="form-label">Imagen del Plato</label>
            <input type="file" class="form-control" id="dishImage" accept="image/*">
          </div>
        </div>
        <div class="row mb-2">
          <select class="form-select" id="Selection" aria-label="Default select example">
            <option selected disabled>¿Qué tipo de plato es?</option>
            <option value="Postre">Postre</option>
            <option value="Comida">Comida</option>
            <option value="Bebida">Bebida</option>
          </select>
        </div>
        <button type="submit" class="btn btn-custom w-100">Guardar</button>
      </form>
    </div>
  `;

  // Aquí puedes agregar lógica para cargar los datos del plato existente en el formulario
  console.log(id);
  cargarDatosPlato(id);
}

function cargarDatosPlato(id) {
  const formData = new FormData();
  formData.append("Id", id);
  formData.append("Nombre", document.getElementById("dishName").value);
  formData.append("Descripcion",document.getElementById("dishDescription").value);
  formData.append("Precio",parseFloat(document.getElementById("dishPrice").value));
  formData.append("Imagen", document.getElementById("dishImage").files[0] || null);
  formData.append("Selection", document.getElementById("Selection").value)


  fetch("/gestMenuM", {
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
      })
    })
    .catch((error) => console.error("Error:", error));
}
