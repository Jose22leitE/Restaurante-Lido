const z = require("zod");

class mainModels {
  static Validation(tipo, data) {
    let schema;
    if (tipo === 1) {
      schema = z.object({
        name: z.string().nonempty(),
        Contraseña: z.string().nonempty(),
        Telefono: z.string().nonempty(),
        correo: z.string().email(),
      });
    } else if (tipo === 2) {
      schema = z.object({
        correo: z.string().email(),
        Contraseña: z.string().nonempty(),
      });
    }
  
    try {
      schema.parse(data);
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }
  

  static formatValidationErrors(errors) {
    return errors
      .map((err) => {
        return `Error en ${err.path.join(".")}: ${err.message}`;
      })
      .join("\n");
  }
}

module.exports = mainModels;
