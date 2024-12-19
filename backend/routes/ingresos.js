import express from "express";
import Ingreso from "../models/Ingreso.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Crear fecha con zona horaria de Argentina
    const fechaInput = new Date(req.body.fecha + "T00:00:00.000-03:00");

    const ingreso = new Ingreso({
      fecha: fechaInput,
      importe: req.body.importe,
      categoria: {
        codigo: req.body.categoria.codigo,
        nombre: req.body.categoria.nombre,
        rutaCategoria: req.body.categoria.rutaCategoria,
      },
    });

    const nuevoIngreso = await ingreso.save();
    res.status(201).json(nuevoIngreso);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al guardar el ingreso",
      error: error.message,
    });
  }
});

// Endpoint para obtener todos los ingresos
router.get("/", async (req, res) => {
  try {
    const ingresos = await Ingreso.find()
      .sort({ _id: -1 }) // Ordenar por _id descendente (último creado primero)
      .limit(50);
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los ingresos",
      error: error.message,
    });
  }
});

export default router;
