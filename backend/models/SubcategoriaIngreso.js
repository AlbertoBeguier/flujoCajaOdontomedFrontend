import mongoose from "mongoose";

const subcategoriaIngresoSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    nivel: { type: Number, required: true },
    categoriaPadre: { type: String, default: null },
    activo: { type: Boolean, default: true },
    listaMaestra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListaMaestra",
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware pre-save para validar código único
subcategoriaIngresoSchema.pre("save", async function (next) {
  try {
    const existente = await this.constructor.findOne({ codigo: this.codigo });
    if (existente) {
      throw new Error("Ya existe una subcategoría con este código");
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("SubcategoriaIngreso", subcategoriaIngresoSchema);
