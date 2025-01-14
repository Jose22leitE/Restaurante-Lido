// Simular estados desde el backend
let userState = {
  isLoggedIn: false,
  role: "guest", // Opciones: "guest", "user", "admin"
};

// Elementos de la barra de navegación
const userButton = document.getElementById("userButton");
const reservationButton = document.getElementById("reservationButton");

// Actualizar la barra de navegación según el estado del usuario
function updateNavbar() {
  if (userState.isLoggedIn) {
    if (userState.role === "user") {
      userButton.textContent = "Mi Perfil";
      userButton.classList.replace("btn-outline-light", "btn-info");
      userButton.onclick = () => {
        // Mostrar perfil o cerrar sesión
        showUserMenu();
      };
    } else if (userState.role === "admin") {
      userButton.textContent = "Admin";
      userButton.classList.replace("btn-outline-light", "btn-warning");
      userButton.onclick = () => {
        showAdminMenu();
      };
    }
  } else {
    userButton.textContent = "Iniciar Sesión / Registrarse";
    userButton.classList.replace("btn-info", "btn-outline-light");
    userButton.classList.replace("btn-warning", "btn-outline-light");
    userButton.onclick = () => {
      window.location.href = "/login";
    };
  }
}

// Acción del botón de reserva
reservationButton.addEventListener("click", () => {
  if (!userState.isLoggedIn) {
    Swal.fire({
      icon: "warning",
      title: "Debe iniciar sesión",
      text: "Por favor, inicie sesión o regístrese para hacer una reserva.",
    });
  } else if (userState.role === "admin") {
    Swal.fire({
      icon: "error",
      title: "Acción no permitida",
      text: "Los administradores no pueden hacer reservas.",
    });
  } else {
    window.location.href = "/reserva";
  }
});

// Mostrar menú del usuario (perfil y cerrar sesión)
function showUserMenu() {
  Swal.fire({
    title: "Opciones",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Perfil",
    denyButtonText: "Cerrar Sesión",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/profile";
    } else if (result.isDenied) {
      userState = { isLoggedIn: false, role: "guest" };
      updateNavbar();
    }
  });
}

// Mostrar menú del administrador
function showAdminMenu() {
  Swal.fire({
    title: "Opciones de Admin",
    showDenyButton: true,
    confirmButtonText: "Panel Admin",
    denyButtonText: "Cerrar Sesión",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/admin";
    } else if (result.isDenied) {
      userState = { isLoggedIn: false, role: "guest" };
      updateNavbar();
    }
  });
}

// Inicializar barra de navegación
updateNavbar();
