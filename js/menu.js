// Selección de tabs y filtrado de contenido
document.querySelectorAll(".menu-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      // Quitar clase activa de los demás tabs
      document.querySelectorAll(".menu-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
  
      // Obtener categoría seleccionada
      const category = tab.getAttribute("data-category");
  
      // Mostrar/ocultar los elementos según la categoría
      document.querySelectorAll(".menu-item").forEach((item) => {
        if (item.classList.contains(category)) {
          item.classList.remove("d-none");
        } else {
          item.classList.add("d-none");
        }
      });
    });
  });
  