import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ingresosCategoriasRoutes from "./routes/ingresosCategorias.js";
import ingresosRoutes from "./routes/ingresos.js";
import egresosCategoriasRoutes from "./routes/egresosCategorias.js";
import egresosRoutes from "./routes/egresos.js";
import subcategoriasEgresosRoutes from "./routes/subcategoriasEgresos.js";
import authRoutes from "./routes/auth.js";
import subcategoriasIngresosRouter from "./routes/subcategoriasIngresos.js";
import listasMaestrasRouter from "./routes/listasMaestras.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Log del inicio del servidor
console.log("Iniciando servidor en puerto:", PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// Configuración de CORS para entornos de desarrollo y producción
const isDevelopment = process.env.NODE_ENV !== "production";

// Configuración de CORS más flexible para desarrollo
app.use(
  cors({
    origin: isDevelopment
      ? (origin, callback) => {
          // En desarrollo, permitir cualquier origen localhost
          if (!origin || origin.match(/^http:\/\/localhost:\d+$/)) {
            callback(null, true);
          } else {
            callback(new Error("CORS no permitido"));
          }
        }
      : [
          "https://caja-om.estudiobeguier.com", // URL de producción
        ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware para logging de CORS (ayuda a debuggear)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  next();
});

// Log de todas las peticiones
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${
      req.headers.origin
    }`
  );
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Configuración de la conexión a MongoDB
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/FlujoDeCajaOdontomed";
console.log("Intentando conectar a MongoDB...");

mongoose
  .connect(mongoURI)
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((error) => {
    console.error("Error detallado al conectar a MongoDB:", {
      message: error.message,
      code: error.code,
      name: error.name,
    });
  });

// Rutas de tu aplicación
app.use("/api/categorias-ingresos", ingresosCategoriasRoutes);
app.use("/api/categorias-egresos", egresosCategoriasRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/egresos", egresosRoutes);
app.use("/api/subcategorias-egresos", subcategoriasEgresosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subcategorias-ingresos", subcategoriasIngresosRouter);
app.use("/api/listas-maestras", listasMaestrasRouter);

// Ruta de prueba
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor funcionando correctamente" });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
