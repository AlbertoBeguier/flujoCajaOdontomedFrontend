import express from "express";
import SubcategoriaIngreso from "../models/SubcategoriaIngreso.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subcategorias = await SubcategoriaIngreso.find().sort({ codigo: 1 });
    res.json(subcategorias);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las subcategorías",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const subcategoria = new SubcategoriaIngreso(req.body);
    await subcategoria.save();
    res.status(201).json(subcategoria);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear la subcategoría",
      error: error.message,
    });
  }
});

export default router;
