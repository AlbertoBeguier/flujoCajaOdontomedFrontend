import express from "express";
import Ingreso from "../models/Ingreso.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const ingreso = new Ingreso({
      fecha: req.body.fecha,
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

export default router;
