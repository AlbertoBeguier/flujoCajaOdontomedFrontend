import mongoose from "mongoose";

const itemListaMaestraSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

const listaMaestraSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  items: [itemListaMaestraSchema],
  activo: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("ListaMaestra", listaMaestraSchema);
