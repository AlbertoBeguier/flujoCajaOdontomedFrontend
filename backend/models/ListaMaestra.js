import mongoose from "mongoose";

const itemNivel8Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
});

const itemNivel7Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel8Schema],
});

const itemNivel6Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel7Schema],
});

const itemNivel5Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel6Schema],
});

const itemNivel4Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel5Schema],
});

const itemNivel3Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel4Schema],
});

const itemNivel2Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel3Schema],
});

const itemNivel1Schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
  items: [itemNivel2Schema],
});

const listaMaestraSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  items: [itemNivel1Schema],
  activo: { type: Boolean, default: true },
});

export default mongoose.model("ListaMaestra", listaMaestraSchema);
