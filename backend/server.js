import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ingresosCategoriasRoutes from "./routes/ingresosCategorias.js";
import ingresosRoutes from "./routes/ingresos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://caja-om.estudiobeguier.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const mongoURI =
    process.env.MONGO_URI || "mongodb+srv://aabeguier:FlujoCajaOdontomed1235813@cluster0.xx1m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
    .connect(mongoURI)
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch((error) =>
        console.error("Error al conectar a MongoDB:", error.message)
    );

app.use("/api/categorias-ingresos", ingresosCategoriasRoutes);
app.use("/api/ingresos", ingresosRoutes);

app.get("/", (req, res) => {
    res.json({ mensaje: "Servidor funcionando correctamente" });
});

app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
