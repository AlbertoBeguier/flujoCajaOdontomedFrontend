import mongoose from "mongoose";

const subcategoriaIngresoSchema = new mongoose.Schema(
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
      default: 2,
    },
    categoriaPadre: {
      type: String,
      default: "",
    },
    categoriaBase: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SubcategoriaIngreso", subcategoriaIngresoSchema);
