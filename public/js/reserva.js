// Selección del formulario
const form = document.getElementById('reservation-form');

// Evento al enviar el formulario
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Previene el envío por defecto

    // Obtener datos del formulario
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;

    // Verificar si todos los campos están completos
    if (name && email && phone && date && time && guests) {
        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Reserva realizada con éxito!',
            text: `Gracias, ${name}. Hemos recibido tu reserva para ${date} a las ${time}.
            Pronto recibirás un correo con los detalles.`,
            confirmButtonText: 'Cerrar',
        });

        // Reiniciar el formulario
        form.reset();
    } else {
        // Mostrar mensaje de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos correctamente.',
            confirmButtonText: 'Cerrar',
        });
    }
});

