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
    },
    categoriaPadre: {
      type: String,
      default: null,
    },
    lista: {
      nombre: String,
      items: [
        {
          codigo: String,
          numero: Number,
          nombre: String,
          activo: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
    esLista: {
      type: Boolean,
      default: false,
    },
    codigoBase: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SubcategoriaIngreso", subcategoriaIngresoSchema);
