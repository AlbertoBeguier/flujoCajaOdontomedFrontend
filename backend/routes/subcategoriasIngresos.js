import express from "express";
import SubcategoriaIngreso from "../models/SubcategoriaIngreso.js";

const router = express.Router();

// GET - Obtener todas las subcategorías
router.get("/", async (req, res) => {
  try {
    const subcategorias = await SubcategoriaIngreso.find().sort({ codigo: 1 });
    res.json(subcategorias);
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    res.status(500).json({
      mensaje: "Error al obtener las subcategorías",
      error: error.message,
    });
  }
});

// POST - Crear nueva subcategoría
router.post("/", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    if (!req.body.codigo || !req.body.nombre) {
      return res.status(400).json({
        mensaje:
          "El código y nombre son requeridos para crear una subcategoría",
      });
    }

    // Verificar si ya existe el código
    const existente = await SubcategoriaIngreso.findOne({
      codigo: req.body.codigo,
    });

    if (existente) {
      return res.status(400).json({
        mensaje: "Ya existe una subcategoría con este código",
      });
    }

    const subcategoria = new SubcategoriaIngreso(req.body);
    await subcategoria.save();
    res.status(201).json(subcategoria);
  } catch (error) {
    console.error("Error al crear subcategoría:", error);
    res.status(400).json({
      mensaje: error.message || "Error al crear la subcategoría",
      error: error.message,
    });
  }
});

// PUT - Actualizar subcategoría
router.put("/:codigo", async (req, res) => {
  try {
    const subcategoria = await SubcategoriaIngreso.findOneAndUpdate(
      { codigo: req.params.codigo },
      req.body,
      { new: true }
    );

    if (!subcategoria) {
      return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
    }

    res.json(subcategoria);
  } catch (error) {
    console.error("Error al actualizar subcategoría:", error);
    res.status(500).json({
      mensaje: "Error al actualizar la subcategoría",
      error: error.message,
    });
  }
});

export default router;
