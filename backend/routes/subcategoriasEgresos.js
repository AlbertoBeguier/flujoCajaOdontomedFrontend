import express from "express";
import {
  getSubcategoriasEgresos,
  createSubcategoriaEgreso,
} from "../controllers/subcategoriasEgresosController.js";

const router = express.Router();

router.get("/", getSubcategoriasEgresos);
router.post("/", createSubcategoriaEgreso);

export default router;
