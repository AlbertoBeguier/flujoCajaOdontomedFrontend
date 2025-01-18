import mongoose from "mongoose";

const subcategoriaIngresoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    nivel: {
      type: Number,
      required: true,
    },
    categoriaPadre: {
      type: String,
      default: "",
    },
    activo: {
      type: Boolean,
      default: true,
    },
    listaMaestra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListaMaestra",
    },
  },
  { timestamps: true }
);

// Middleware pre-save para validar código y nombre
subcategoriaIngresoSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      // 1. Verificar si ya existe una subcategoría con el mismo nombre en el mismo nivel
      const existentePorNombre = await this.constructor.findOne({
        nombre: new RegExp(`^${this.nombre.trim()}$`, "i"), // Case insensitive
        categoriaPadre: this.categoriaPadre,
      });

      if (existentePorNombre) {
        throw new Error(
          `Ya existe una subcategoría con el nombre "${this.nombre}" en este nivel`
        );
      }

      // 2. Verificar y ajustar el código si es necesario
      const existentePorCodigo = await this.constructor.findOne({
        codigo: this.codigo,
      });

      if (existentePorCodigo) {
        const partes = this.codigo.split(".");
        const base = partes.slice(0, -1).join(".");

        // Buscar el último número usado para este código base
        const ultimaSubcategoria = await this.constructor
          .findOne({
            codigo: new RegExp(`^${base}\\.\\d+$`),
          })
          .sort({ codigo: -1 });

        if (ultimaSubcategoria) {
          const nuevoNumero =
            parseInt(ultimaSubcategoria.codigo.split(".").pop()) + 1;
          this.codigo = `${base}.${nuevoNumero}`;
        } else {
          this.codigo = `${base}.1`;
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("SubcategoriaIngreso", subcategoriaIngresoSchema);
