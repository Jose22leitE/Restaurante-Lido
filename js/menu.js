document.querySelectorAll(".menu-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        const category = tab.getAttribute("data-category");

        // Ocultar todas las categorías
        document.querySelectorAll(".menu-category").forEach(categoryDiv => {
            categoryDiv.style.display = "none";
        });

        // Mostrar la categoría seleccionada
        document.querySelector(`.menu-category[data-category="${category}"]`).style.display = "block";
    });
});
