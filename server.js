import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ingresosCategoriasRoutes from "./routes/ingresosCategorias.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Conexión a MongoDB
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/FlujoDeCajaOdontomed";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error.message);
  });

// Rutas
app.use("/api/categorias-ingresos", ingresosCategoriasRoutes);

// Ruta de prueba para verificar el funcionamiento del servidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
