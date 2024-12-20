import express from "express";
import Egreso from "../models/Egreso.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Crear fecha con zona horaria de Argentina
    const fechaInput = new Date(req.body.fecha + "T00:00:00.000-03:00");

    const egreso = new Egreso({
      fecha: fechaInput,
      importe: req.body.importe,
      categoria: {
        codigo: req.body.categoria.codigo,
        nombre: req.body.categoria.nombre,
        rutaCategoria: req.body.categoria.rutaCategoria,
      },
    });

    const nuevoEgreso = await egreso.save();
    res.status(201).json(nuevoEgreso);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al guardar el egreso",
      error: error.message,
    });
  }
});

// Endpoint para obtener todos los egresos
router.get("/", async (req, res) => {
  try {
    const egresos = await Egreso.find()
      .sort({ _id: -1 }) // Ordenar por _id descendente (último creado primero)
      .limit(50);
    res.json(egresos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los egresos",
      error: error.message,
    });
  }
});

// Ruta PUT para actualizar egreso
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const egresoActualizado = await Egreso.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // esto retorna el documento actualizado
    );

    if (!egresoActualizado) {
      return res.status(404).json({ mensaje: "Egreso no encontrado" });
    }

    res.json(egresoActualizado);
  } catch (error) {
    console.error("Error al actualizar egreso:", error);
    res.status(500).json({ mensaje: "Error al actualizar el egreso" });
  }
});

export default router;
