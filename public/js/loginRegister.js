document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.querySelector('.formulario--register');
    const formLogin = document.querySelector('.formulario--login');

    formRegister.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formRegister de la manera tradicional

        let Nombre = document.getElementById('Nombre').value;
        let Contraseña = document.getElementById('Contrasena').value;
        let Telefono = document.getElementById('Telefono').value;
        let Correo = document.getElementById('Email').value;

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nombre,
                Contraseña,
                Telefono,
                Correo
            })
        })
        .then(res => res.json())
        .then(res => {
            Swal.fire({
                title: res.titulo,
                text: res.texto,
                icon: res.icono,
                confirmButtonText: 'Aceptar'
            });
        })
        .catch(error => console.error('Error:', error));
    });

    formLogin.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formLogin de la manera tradicional

        let Contraseña = document.getElementById('Contrasena1').value;
        let Correo = document.getElementById('Correo').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Correo,
                Contraseña
            })
        })
        .then(res => res.json()) // Corregido: .json() en lugar de .JSON()
        .then(res => {
            Swal.fire({
                title: res.titulo,
                text: res.texto,
                icon: res.icono,
                confirmButtonText: 'Aceptar'
            }).then(result => {
                if(result.isConfirm()){
                    res.redirect("/home")
                }
            });
        })
        .catch(error => console.error('Error:', error));
    });
});
