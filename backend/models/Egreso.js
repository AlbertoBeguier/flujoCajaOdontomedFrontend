import mongoose from "mongoose";

const egresoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return new Date(now.getTime() - 3 * 60 * 60 * 1000);
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

const Egreso = mongoose.model("Egreso", egresoSchema);

export default Egreso;
