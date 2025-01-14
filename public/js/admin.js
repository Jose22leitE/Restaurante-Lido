// Botón de cancelar reserva
document.getElementById('btn-cancel').addEventListener('click', function () {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción cancelará la reserva.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Cancelado', 'La reserva ha sido cancelada.', 'success');
        }
    });
});

// Botón de aprobar reserva
document.getElementById('btn-approve').addEventListener('click', function () {
    Swal.fire({
        title: '¿Aprobar reserva?',
        text: "Esto aprobará la reserva.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Aprobado', 'La reserva ha sido aprobada.', 'success');
        }
    });
});

// Botón de cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function () {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: "Estás a punto de cerrar sesión.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "login.html"; // Redirige al inicio de sesión
        }
    });
});
