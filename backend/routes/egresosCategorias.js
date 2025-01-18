import express from "express";
import EgresoCategoria from "../models/EgresoCategoria.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await EgresoCategoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Crear nueva categoría
router.post("/", async (req, res) => {
  const categoria = new EgresoCategoria({
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    nivel: req.body.nivel,
    categoriaPadre: req.body.categoriaPadre,
  });

  try {
    const nuevaCategoria = await categoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

export default router;
