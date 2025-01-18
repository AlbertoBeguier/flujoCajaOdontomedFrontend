import mongoose from "mongoose";

const subcategoriaEgresoSchema = new mongoose.Schema(
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
    categoriaBase: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SubcategoriaEgreso", subcategoriaEgresoSchema);
