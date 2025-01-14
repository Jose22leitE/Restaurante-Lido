// Simula el estado de sesión del usuario (puedes integrarlo con tu backend)
let userLoggedIn = false; // Cambia esto a true si el usuario está registrado

// Referencia al botón
const userButton = document.getElementById("userButton");

// Función para actualizar el texto y funcionalidad del botón
function updateUserButton() {
  if (userLoggedIn) {
    userButton.textContent = "Cerrar Sesión";
    userButton.classList.add("btn-danger");
    userButton.classList.remove("btn-outline-light");
    userButton.onclick = () => {
      // Lógica para cerrar sesión
      alert("Has cerrado sesión.");
      userLoggedIn = false;
      updateUserButton();
    };
  } else {
    userButton.textContent = "Iniciar Sesión / Registrarse";
    userButton.classList.remove("btn-danger");
    userButton.classList.add("btn-outline-light");
    userButton.onclick = () => {
      // Redirigir a la página de inicio de sesión o registro
      window.location.href = "login";
    };
  }
}

// Inicializa el botón al cargar la página
updateUserButton();
