import mongoose from "mongoose";

const egresoCategoriaSchema = new mongoose.Schema(
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

const EgresoCategoria = mongoose.model(
  "EgresoCategoria",
  egresoCategoriaSchema
);

export default EgresoCategoria;
