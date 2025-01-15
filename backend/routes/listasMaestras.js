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
    const { nombre, parentId, nivel } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del item es requerido" });
    }

    const lista = await ListaMaestra.findById(id);
    if (!lista) {
      return res.status(404).json({ message: "Lista maestra no encontrada" });
    }

    const agregarSubitemRecursivo = (items, nivelActual = 1) => {
      // No permitir más de 8 niveles
      if (nivelActual > 8) return false;

      // Si estamos en un nivel específico y no coincide, no permitir la operación
      if (nivel && nivelActual !== parseInt(nivel)) {
        return false;
      }

      for (let item of items) {
        if (item._id.toString() === parentId) {
          if (!item.items) item.items = [];
          item.items.push({ nombre, items: [] });
          return true;
        }

        if (item.items && item.items.length > 0) {
          if (agregarSubitemRecursivo(item.items, nivelActual + 1)) {
            return true;
          }
        }
      }
      return false;
    };

    if (!parentId) {
      // Si se especifica un nivel, verificar que sea el correcto para items principales
      if (nivel && parseInt(nivel) !== 1) {
        return res.status(400).json({
          message: "No se puede agregar un item principal en este nivel",
        });
      }
      lista.items.push({ nombre, items: [] });
    } else {
      const resultado = agregarSubitemRecursivo(lista.items);
      if (!resultado) {
        return res.status(404).json({
          message: "Item padre no encontrado o nivel no permitido",
        });
      }
    }

    await lista.save();
    res.status(201).json(lista);
  } catch (error) {
    console.error("Error al agregar item:", error);
    res.status(500).json({
      message: "Error al agregar item",
      error: error.message,
    });
  }
});

export default router;
