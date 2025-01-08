const fs = require('fs');

const fs = require('fs').promises;

class ViewModel {
    constructor() {
        // Constructor para inicializar cualquier propiedad si es necesario
    }

    async EncontrarVista(url) {
        try {
            await fs.access(`../view/content/${url}-view.html`);
            console.log(`El archivo ${url}-view.html existe.`);
            // Aquí puedes añadir el código adicional que necesites si el archivo existe
        } catch (err) {
            console.log(`El archivo ${url}-view.html no existe.`);
            // Aquí puedes añadir el código adicional que necesites si el archivo no existe
        }
    }
}

// Ejemplo de uso
const viewModel = new ViewModel();
viewModel.EncontrarVista('nombre_del_archivo');
   