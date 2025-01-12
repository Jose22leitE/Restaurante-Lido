let menu = [];

// Renderizar las tarjetas de los platos
function renderMenu() {
    const menuCards = document.getElementById('menuCards');
    menuCards.innerHTML = '';
    menu.forEach((dish, index) => {
        menuCards.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${dish.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${dish.name}">
                    <div class="card-body">
                        <h5 class="card-title">${dish.name}</h5>
                        <p class="card-text">
                            Precio: $${dish.price.toFixed(2)}<br>
                            Descripción: ${dish.description}
                        </p>
                        <button class="btn btn-danger btn-sm" onclick="deleteDish(${index})">Eliminar</button>
                        <button class="btn btn-warning btn-sm" onclick="editDish(${index})">Modificar</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Agregar un plato
document.getElementById('addDishForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('dishName').value;
    const description = document.getElementById('dishDescription').value;
    const price = parseFloat(document.getElementById('dishPrice').value);
    const image = document.getElementById('dishImage').files[0] ? URL.createObjectURL(document.getElementById('dishImage').files[0]) : '';
    menu.push({ name, description, price, image });
    renderMenu();
    this.reset();
});

// Eliminar un plato
function deleteDish(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            menu.splice(index, 1);
            renderMenu();
            Swal.fire(
                'Eliminado',
                'El plato ha sido eliminado con éxito.',
                'success'
            );
        }
    });
}

// Modificar un plato
function editDish(index) {
    const dish = menu[index];
    Swal.fire({
        title: 'Editar Plato',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${dish.name}">
            <input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${dish.description}">
            <input id="swal-input3" class="swal2-input" type="number" placeholder="Precio" value="${dish.price}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('swal-input1').value;
            const description = document.getElementById('swal-input2').value;
            const price = parseFloat(document.getElementById('swal-input3').value);
            if (!name || !description || isNaN(price)) {
                Swal.showValidationMessage('Por favor, completa todos los campos correctamente.');
                return;
            }
            return { name, description, price };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { name, description, price } = result.value;
            menu[index] = { ...dish, name, description, price };
            renderMenu();
            Swal.fire(
                'Modificado',
                'El plato ha sido actualizado con éxito.',
                'success'
            );
        }
    });
}

renderMenu();
