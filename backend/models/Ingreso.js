import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    importe: {
      type: Number,
      required: true,
    },
    categoria: {
      codigo: {
        type: String,
        required: true,
      },
      nombre: {
        type: String,
        required: true,
      },
      rutaCategoria: [
        {
          codigo: String,
          nombre: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Ingreso = mongoose.model("Ingreso", ingresoSchema);

export default Ingreso;
