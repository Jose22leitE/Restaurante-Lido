const z = require("zod");

class Validation {
  static ValidationNombre(Nombre) {
    const schema = z.object({
      Nombre: z
        .string({ message: "Verifique su nombre" })
        .nonempty({ message: "El nombre no puede estar vacío" })
        .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
        .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
    });
    try {
      schema.parse({ Nombre });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationCorreo(Correo) {
    const schema = z.object({
      Correo: z
        .string({ message: "Verifique su Correo" })
        .trim()
        .email({ message: "El correo no es válido" }),
    });
    try {
      schema.parse({ Correo });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationTelefono(Telefono) {
    const schema = z.object({
      Telefono: z
        .string({ message: "Verifique su Teléfono" })
        .nonempty({ message: "El teléfono no puede estar vacío" })
        .regex(/^\d{11}$/, { message: "El teléfono debe tener 11 dígitos" }),
    });
    try {
      schema.parse({ Telefono });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationContraseña(Contraseña) {
    const schema = z.object({
      Contraseña: z
        .string({ message: "Verifique su Contraseña" })
        .nonempty({ message: "La Contraseña no puede estar vacía" })
        .min(6, { message: "La Contraseña debe tener al menos 6 caracteres" })
        .max(20, { message: "La Contraseña debe tener máximo 20 caracteres" }),
    });
    try {
      schema.parse({ Contraseña });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationFecha(Fecha) {
    const schema = z.object({
      Fecha: z
        .string({ message: "Verifique su Fecha" })
        .refine((val) => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
    });
    try {
      schema.parse({ Fecha });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationHora(Hora) {
    const schema = z.object({
      Hora: z
        .string({ message: "Verifique su Hora" })
        .nonempty({ message: "La Hora no puede estar vacía" })
        .refine((val) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(val), { message: "Hora inválida" }),
    });
    try {
      schema.parse({ Hora });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationPersonas(Personas) {
    const schema = z.object({
      Personas: z
        .number({ message: "Verifique el número de Personas" })
        .int({ message: "El número de Personas debe ser un entero" })
        .positive({ message: "El número de Personas debe ser positivo" }),
    });
    try {
      schema.parse({ Personas });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationDescripcion(Descripcion) {
    const schema = z.object({
      Descripcion: z.string({ message: "Verifique la descripción" }).nonempty({ message: "La descripción no puede estar vacía" }).min(30, { message: "La descripción debe tener al menos 30 caracteres" }).max(200, { message: "La descripción no puede tener más de 200 caracteres" }),
    })
    try {
      schema.parse({ Descripcion });
      return true;
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  
  }

  static ValidationPrecio(Precio) {
    try {
      const parsedPrecio = parseFloat(Precio);
      if (!isNaN(parsedPrecio) && parsedPrecio > 0) {
        return true;
      } else {
        return "El precio debe ser un número positivo y decimal";
      }
    } catch (error) {
      return this.formatValidationErrors(error.errors);
    }
  }

  static ValidationImagen(Imagen){
    if(!Imagen) return "La Imagen es requerida";
    Imagen.extension = Imagen.extension.toLowerCase();
    if (Imagen.extension !== ".jpg" && Imagen.extension !== ".webp" && Imagen.extension !== ".png" && Imagen.extension !== ".jpeg") return "La extensión de la Imagen no es válida";
    if (Imagen.size > 5000000) return "La imagen es demasiado grande";
    
    return true;
  }
  
  static ValidationMenu(Selection) {
    const validMenus = ["Comida", "Postre", "Bebida"];
    if (!validMenus.includes(Selection)) {
      return "Lo sentimos, ese tipo de menú no existe";
    }
    return true;
  }
  
  
  static formatValidationErrors(errors) {
    if (!Array.isArray(errors)) {
      return errors;
    }
    return errors
      .map((err) => {
        return `Error en ${err.path.join(".")}: ${err.message}`;
      })
      .join("\n");
  }
}

module.exports = Validation;
