import express from "express";
import CategoriaEgreso from "../models/CategoriaEgreso.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categorias = await CategoriaEgreso.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las categorías",
      error: error.message,
    });
  }
});

export default router;
