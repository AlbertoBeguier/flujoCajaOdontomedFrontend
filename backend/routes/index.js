import express from "express";
import categoriasIngresos from "./categoriasIngresos.js";
import subcategoriasIngresos from "./subcategoriasIngresos.js";
import ingresos from "./ingresos.js";
import auth from "./auth.js";
import usuarios from "./usuarios.js";
import categoriasEgresos from "./categoriasEgresos.js";
import subcategoriasEgresos from "./subcategoriasEgresos.js";
import egresos from "./egresos.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/usuarios", usuarios);
router.use("/categorias-ingresos", categoriasIngresos);
router.use("/subcategorias-ingresos", subcategoriasIngresos);
router.use("/ingresos", ingresos);
router.use("/categorias-egresos", categoriasEgresos);
router.use("/subcategorias-egresos", subcategoriasEgresos);
router.use("/egresos", egresos);

export default router;
