const express = require("express");
const router = express.Router();
const ListaMaestra = require("../models/ListaMaestra");
const ItemListaMaestra = require("../models/ItemListaMaestra");

// Obtener todas las listas
router.get("/", async (req, res) => {
  try {
    const listas = await ListaMaestra.findAll({
      include: [
        {
          model: ItemListaMaestra,
          as: "items",
          attributes: ["id", "nombre", "listaAsociadaId"],
        },
      ],
      attributes: ["id", "nombre", "descripcion"],
    });
    res.json(listas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una lista específica con sus items
router.get("/:id", async (req, res) => {
  try {
    const lista = await ListaMaestra.findByPk(req.params.id, {
      include: [
        {
          model: ItemListaMaestra,
          as: "items",
          attributes: ["id", "nombre", "listaAsociadaId"],
        },
      ],
    });
    if (!lista) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }
    res.json(lista);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nueva lista
router.post("/", async (req, res) => {
  try {
    const lista = await ListaMaestra.create(req.body);
    res.status(201).json(lista);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Agregar item a lista
router.post("/:listaId/items", async (req, res) => {
  try {
    const item = await ItemListaMaestra.create({
      ...req.body,
      listaId: req.params.listaId,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
