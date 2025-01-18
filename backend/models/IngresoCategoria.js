import mongoose from "mongoose";

const ingresoCategoriaSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    nivel: {
      type: Number,
      required: true,
    },
    categoriaPadre: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const IngresoCategoria = mongoose.model(
  "IngresoCategoria",
  ingresoCategoriaSchema
);

export default IngresoCategoria;
