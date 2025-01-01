import express from "express";
import ListaMaestra from "../models/ListaMaestra.js";

const router = express.Router();

// GET /api/listas-maestras
router.get("/", async (req, res) => {
  try {
    const listas = await ListaMaestra.find();
    res.json(listas);
  } catch (error) {
    console.error("Error al obtener listas maestras:", error);
    res.status(500).json({ message: "Error al obtener listas maestras" });
  }
});

// POST /api/listas-maestras
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validar datos requeridos
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    // Crear nueva lista maestra
    const nuevaLista = new ListaMaestra({
      nombre,
      descripcion,
      items: [], // Inicialmente sin items
    });

    // Guardar en la base de datos
    const listaGuardada = await nuevaLista.save();

    res.status(201).json(listaGuardada);
  } catch (error) {
    console.error("Error al crear lista maestra:", error);
    res.status(500).json({ message: "Error al crear lista maestra" });
  }
});

// POST /api/listas-maestras/:id/items
router.post("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, parentId } = req.body;

    // Validar datos requeridos
    if (!nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del item es requerido" });
    }

    // Buscar la lista maestra
    const lista = await ListaMaestra.findById(id);
    if (!lista) {
      return res.status(404).json({ message: "Lista maestra no encontrada" });
    }

    // Si no hay parentId, agregar al nivel principal
    if (!parentId) {
      lista.items.push({ nombre, items: [] });
    } else {
      // Función recursiva para encontrar y actualizar el item padre
      const agregarSubitem = (items) => {
        for (let item of items) {
          if (item._id.toString() === parentId) {
            if (!item.items) item.items = [];
            item.items.push({ nombre, items: [] });
            return true;
          }
          if (item.items && item.items.length > 0) {
            if (agregarSubitem(item.items)) return true;
          }
        }
        return false;
      };

      if (!agregarSubitem(lista.items)) {
        return res.status(404).json({ message: "Item padre no encontrado" });
      }
    }

    await lista.save();
    res.status(201).json(lista);
  } catch (error) {
    console.error("Error al agregar item:", error);
    res.status(500).json({ message: "Error al agregar item" });
  }
});

export default router;
