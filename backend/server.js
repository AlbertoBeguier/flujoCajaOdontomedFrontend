import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ingresosCategoriasRoutes from "./routes/ingresosCategorias.js";
import ingresosRoutes from "./routes/ingresos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Log del inicio del servidor
console.log("Iniciando servidor en puerto:", PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// Configuración de CORS para entornos de desarrollo y producción
const allowedOrigins = [
  "http://localhost:5173", // Origen para desarrollo local
  "https://caja-om.estudiobeguier.com", // Origen para producción
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Permite Postman y otras herramientas
      if (allowedOrigins.includes(origin)) {
        return callback(null, true); // Origen permitido
      }
      return callback(
        new Error(`CORS bloqueado: origen no permitido: ${origin}`)
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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
app.use("/api/ingresos", ingresosRoutes);

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
