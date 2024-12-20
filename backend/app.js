// Importar el router de egresos
import egresosRouter from "./routes/egresos.js";
import categoriasEgresosRouter from "./routes/categoriasEgresos.js";

// ... otros imports y configuración

// Agregar la ruta
app.use("/api/egresos", egresosRouter);
app.use("/api/categorias-egresos", categoriasEgresosRouter);
