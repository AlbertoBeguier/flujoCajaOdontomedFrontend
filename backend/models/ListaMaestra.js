import mongoose from "mongoose";

// Definimos el esquema del item
const itemSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  codigo: {
    type: String,
    trim: true,
  },
  nivel: {
    type: Number,
    default: 0,
  },
});

// Agregamos la referencia a los items después de definir el esquema
itemSchema.add({
  items: [itemSchema],
});

const listaMaestraSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: "",
    },
    items: [itemSchema],
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware para asegurar que los items sean únicos por nombre en su nivel
listaMaestraSchema.pre("save", function (next) {
  const verificarNombresUnicos = (items, nivel = 0) => {
    const nombresEnNivel = new Set();
    items.forEach((item) => {
      if (nombresEnNivel.has(item.nombre.toLowerCase())) {
        throw new Error(
          `Nombre duplicado "${item.nombre}" en el nivel ${nivel}`
        );
      }
      nombresEnNivel.add(item.nombre.toLowerCase());

      item.nivel = nivel;

      if (item.items && item.items.length > 0) {
        verificarNombresUnicos(item.items, nivel + 1);
      }
    });
  };

  try {
    verificarNombresUnicos(this.items);
    next();
  } catch (error) {
    next(error);
  }
});

const ListaMaestra = mongoose.model("ListaMaestra", listaMaestraSchema);

export default ListaMaestra;
