import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ingresosCategoriasRoutes from "./routes/ingresosCategorias.js";
import ingresosRoutes from "./routes/ingresos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

console.log('Iniciando servidor en puerto:', PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(cors({
  origin: 'https://caja-om.estudiobeguier.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log todas las peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/FlujoDeCajaOdontomed";
console.log('Intentando conectar a MongoDB...');

mongoose
    .connect(mongoURI)
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch((error) => {
        console.error("Error detallado al conectar a MongoDB:", {
            message: error.message,
            code: error.code,
            name: error.name
        });
    });

app.use("/api/categorias-ingresos", ingresosCategoriasRoutes);
app.use("/api/ingresos", ingresosRoutes);

// Ruta de prueba
app.get("/test", (req, res) => {
    res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

app.get("/", (req, res) => {
    res.json({ mensaje: "Servidor funcionando correctamente" });
});

app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});