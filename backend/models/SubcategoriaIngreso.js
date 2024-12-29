import mongoose from "mongoose";

// Definimos el esquema de item de forma recursiva
const itemSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  numero: Number,
  activo: { type: Boolean, default: true },
  esLista: { type: Boolean, default: false },
  lista: {
    nombre: String,
    items: [], // Esto permitirá items anidados infinitamente
  },
});

// Referencia circular para permitir anidación infinita
itemSchema.add({ "lista.items": [itemSchema] });

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
    esLista: {
      type: Boolean,
      default: false,
    },
    lista: {
      nombre: String,
      items: [itemSchema],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SubcategoriaIngreso", subcategoriaIngresoSchema);
