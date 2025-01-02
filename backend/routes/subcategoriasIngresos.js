import express from "express";
import SubcategoriaIngreso from "../models/SubcategoriaIngreso.js";
import ListaMaestra from "../models/ListaMaestra.js";

const router = express.Router();

// GET - Obtener todas las subcategorías
router.get("/", async (req, res) => {
  try {
    const subcategorias = await SubcategoriaIngreso.find().sort({ codigo: 1 });
    res.json(subcategorias);
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    res.status(500).json({
      mensaje: "Error al obtener las subcategorías",
      error: error.message,
    });
  }
});

// POST - Crear nueva subcategoría
router.post("/", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    if (!req.body.codigo || !req.body.nombre) {
      return res.status(400).json({
        mensaje:
          "El código y nombre son requeridos para crear una subcategoría",
      });
    }

    // Verificar si ya existe el código
    const existente = await SubcategoriaIngreso.findOne({
      codigo: req.body.codigo,
    });

    if (existente) {
      return res.status(400).json({
        mensaje: "Ya existe una subcategoría con este código",
      });
    }

    const subcategoria = new SubcategoriaIngreso(req.body);
    await subcategoria.save();
    res.status(201).json(subcategoria);
  } catch (error) {
    console.error("Error al crear subcategoría:", error);
    res.status(400).json({
      mensaje: error.message || "Error al crear la subcategoría",
      error: error.message,
    });
  }
});

// PUT - Actualizar subcategoría
router.put("/:codigo", async (req, res) => {
  try {
    const subcategoria = await SubcategoriaIngreso.findOneAndUpdate(
      { codigo: req.params.codigo },
      req.body,
      { new: true }
    );

    if (!subcategoria) {
      return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
    }

    res.json(subcategoria);
  } catch (error) {
    console.error("Error al actualizar subcategoría:", error);
    res.status(500).json({
      mensaje: "Error al actualizar la subcategoría",
      error: error.message,
    });
  }
});

// POST - Asignar lista maestra a una subcategoría
router.post("/:codigo/asignar-lista", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { listaId } = req.body;

    if (!listaId) {
      return res.status(400).json({
        mensaje: "Se requiere el ID de la lista maestra",
      });
    }

    const subcategoria = await SubcategoriaIngreso.findOne({ codigo });
    if (!subcategoria) {
      return res.status(404).json({
        mensaje: "Subcategoría no encontrada",
      });
    }

    subcategoria.listaMaestra = listaId;
    await subcategoria.save();

    res.json(subcategoria);
  } catch (error) {
    console.error("Error al asignar lista:", error);
    res.status(500).json({
      mensaje: "Error al asignar la lista maestra",
      error: error.message,
    });
  }
});

// POST - Convertir lista maestra en subcategorías
router.post("/:codigo/convertir-lista", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { listaId } = req.body;

    // 1. Obtener la lista maestra
    const listaMaestra = await ListaMaestra.findById(listaId);
    if (!listaMaestra) {
      return res.status(404).json({ mensaje: "Lista maestra no encontrada" });
    }

    // 2. Función recursiva para crear subcategorías
    const crearSubcategorias = async (items, codigoBase) => {
      const subcategorias = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const codigoNuevo = `${codigoBase}.${i + 1}`;
        const nivel = codigoNuevo.split(".").length;

        const subcategoria = new SubcategoriaIngreso({
          codigo: codigoNuevo,
          nombre: item.nombre,
          nivel: nivel,
          categoriaPadre: codigoBase,
          activo: true,
        });

        await subcategoria.save();
        subcategorias.push(subcategoria);

        if (item.items && item.items.length > 0) {
          await crearSubcategorias(item.items, codigoNuevo);
        }
      }

      return subcategorias;
    };

    // 3. Crear las subcategorías de los items
    const subcategoriasCreadas = await crearSubcategorias(
      listaMaestra.items,
      codigo // Pasamos solo el código base
    );

    res.json({
      mensaje: "Lista convertida exitosamente",
      subcategorias: subcategoriasCreadas,
    });
  } catch (error) {
    console.error("Error al convertir lista:", error);
    res.status(500).json({
      mensaje: "Error al convertir la lista en subcategorías",
      error: error.message,
    });
  }
});

// POST - Sincronizar todas las subcategorías
router.post("/sincronizar", async (req, res) => {
  try {
    // 1. Obtener todas las subcategorías
    const subcategorias = await SubcategoriaIngreso.find().sort({ codigo: 1 });

    // 2. Obtener categorías principales (nivel 1)
    const categoriasPrincipales = subcategorias.filter(
      (sub) => sub.nivel === 1
    );

    // 3. Para cada categoría principal, sincronizar sus subcategorías
    const resultados = [];

    for (const categoriaPrincipal of categoriasPrincipales) {
      // Obtener todas las subcategorías que pertenecen a esta categoría principal
      const subcategoriasMismoPadre = subcategorias.filter((sub) =>
        sub.codigo.startsWith(categoriaPrincipal.codigo + ".")
      );

      // Agrupar por nivel 2 (hijos directos de la categoría principal)
      const gruposNivel2 = new Map();
      subcategoriasMismoPadre
        .filter((sub) => sub.nivel === 2)
        .forEach((sub) => {
          const subHijas = subcategoriasMismoPadre.filter((s) =>
            s.codigo.startsWith(sub.codigo + ".")
          );
          gruposNivel2.set(sub.codigo, {
            subcategoria: sub,
            hijas: subHijas,
            cantidad: subHijas.length,
          });
        });

      if (gruposNivel2.size > 0) {
        // Encontrar el más completo en este grupo
        const masCompleto = Array.from(gruposNivel2.values()).reduce(
          (prev, curr) => (curr.cantidad > prev.cantidad ? curr : prev)
        );

        // Sincronizar los demás con el más completo
        for (const datos of gruposNivel2.values()) {
          if (datos.cantidad < masCompleto.cantidad) {
            const nuevas = await sincronizarCategoria(
              datos.subcategoria,
              masCompleto.subcategoria,
              masCompleto.hijas,
              subcategorias
            );
            resultados.push(...nuevas);
          }
        }
      }
    }

    res.json({
      mensaje: "Sincronización completada",
      subcategorias: resultados,
    });
  } catch (error) {
    console.error("Error al sincronizar:", error);
    res.status(500).json({
      mensaje: "Error al sincronizar las subcategorías",
      error: error.message,
    });
  }
});

// Función auxiliar para sincronizar una categoría
async function sincronizarCategoria(
  categoriaDestino,
  categoriaOrigen,
  subcategoriasOrigen,
  todasLasSubcategorias
) {
  const nuevasSubcategorias = [];

  for (const subOrigen of subcategoriasOrigen) {
    // Calcular el nuevo código basado en la categoría destino
    const codigoRelativo = subOrigen.codigo.substring(
      categoriaOrigen.codigo.length
    );
    const nuevoCodigo = categoriaDestino.codigo + codigoRelativo;

    // Verificar si ya existe
    const existe = todasLasSubcategorias.some(
      (sub) => sub.codigo === nuevoCodigo
    );

    if (!existe) {
      const nuevaSubcategoria = new SubcategoriaIngreso({
        codigo: nuevoCodigo,
        nombre: subOrigen.nombre,
        nivel: subOrigen.nivel,
        categoriaPadre: nuevoCodigo.split(".").slice(0, -1).join("."),
        activo: true,
        listaMaestra: subOrigen.listaMaestra,
      });

      await nuevaSubcategoria.save();
      nuevasSubcategorias.push(nuevaSubcategoria);
    }
  }

  return nuevasSubcategorias;
}

export default router;
