import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      // Ajustar a zona horaria de Argentina (UTC-3)
      now.setHours(0, 0, 0, 0);
      return new Date(now.getTime() - 3 * 60 * 60 * 1000); // -3 horas para Argentina
    },
  },
  importe: {
    type: Number,
    required: true,
  },
  categoria: {
    codigo: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    rutaCategoria: [
      {
        codigo: String,
        nombre: String,
      },
    ],
  },
  subcategoria: {
    codigo: {
      type: String,
    },
    nombre: {
      type: String,
    },
    rutaSubcategoria: [
      {
        codigo: String,
        nombre: String,
      },
    ],
  },
  observaciones: {
    type: String,
    default: "",
  },
});

const Ingreso = mongoose.model("Ingreso", ingresoSchema);

export default Ingreso;
