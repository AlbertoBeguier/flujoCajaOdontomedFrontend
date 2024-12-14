import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ingresosCategoriasRoutes from "./routes/ingresosCategorias.js";
import ingresosRoutes from "./routes/ingresos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/FlujoDeCajaOdontomed";
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
