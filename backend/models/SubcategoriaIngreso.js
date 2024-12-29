import mongoose from "mongoose";

const subcategoriaIngresoSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    nivel: { type: Number, required: true },
    categoriaPadre: { type: String, default: null },
    esLista: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SubcategoriaIngreso", subcategoriaIngresoSchema);
