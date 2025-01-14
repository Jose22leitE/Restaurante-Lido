let menu = [];

// Renderizar las tarjetas de los platos
function renderMenu() {
  const menuCards = document.getElementById("menuCards");
  menuCards.innerHTML = ""; // Limpiar el contenido anterior
  menu.forEach((dish) => {
    menuCards.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="/img_recetas/${dish.Imagen}" class="card-img-top" alt="${dish.Nombre}">
          <div class="card-body">
            <h5 class="card-title">${dish.Nombre}</h5>
            <p class="card-text">
              Precio: $${dish.Precio.toFixed(2)}<br>
              Descripción: ${dish.Descripcion}
            </p>
            <button class="btn btn-danger btn-sm" onclick="deleteDish(${dish.Id})">Eliminar</button>
            <button class="btn btn-warning btn-sm" onclick="editDish(${dish.Id})">Modificar</button>
          </div>
        </div>
      </div>
    `;
  });
}

document.getElementById("addDishForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("Nombre", document.getElementById("dishName").value);
  formData.append("Descripcion", document.getElementById("dishDescription").value);
  formData.append("Precio", parseFloat(document.getElementById("dishPrice").value));
  formData.append("Imagen", document.getElementById("dishImage").files[0]);

  const plato = {
    Nombre: document.getElementById("dishName").value,
    Descripcion: document.getElementById("dishDescription").value,
    Precio: parseFloat(document.getElementById("dishPrice").value)
  };

  fetch("/gestMenuA", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      Swal.fire({
        title: res.titulo,
        text: res.texto,
        icon: res.icono,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed && res.success === 'success') {
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
function deleteDish(index) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      menu.splice(index, 1);
      renderMenu();
      Swal.fire(
        "Eliminado",
        "El plato ha sido eliminado con éxito.",
        "success"
      );
    }
  });
}

// Modificar un plato
function editDish(index) {
  const dish = menu[index];
  Swal.fire({
    title: "Editar Plato",
    html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${dish.Nombre}">
            <input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${dish.description}">
            <input id="swal-input3" class="swal2-input" type="number" placeholder="Precio" value="${dish.price}">
        `,
    focusConfirm: false,
    preConfirm: () => {
      const Nombre = document.getElementById("swal-input1").value;
      const description = document.getElementById("swal-input2").value;
      const price = parseFloat(document.getElementById("swal-input3").value);
      if (!Nombre || !description || isNaN(price)) {
        Swal.showValidationMessage(
          "Por favor, completa todos los campos correctamente."
        );
        return;
      }
      return { Nombre, description, price };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { Nombre, description, price } = result.value;
      menu[index] = { ...dish, Nombre, description, price };
      renderMenu();
      Swal.fire(
        "Modificado",
        "El plato ha sido actualizado con éxito.",
        "success"
      );
    }
  });
}

renderMenu();
