import mongoose from "mongoose";

const categoriaEgresoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  categoriaPadre: {
    type: String,
    default: null,
  },
  descripcion: {
    type: String,
    default: "",
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

const CategoriaEgreso = mongoose.model(
  "CategoriaEgreso",
  categoriaEgresoSchema
);

export default CategoriaEgreso;
