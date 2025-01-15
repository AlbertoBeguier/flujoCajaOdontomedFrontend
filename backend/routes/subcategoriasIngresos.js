import express from "express";
import SubcategoriaIngreso from "../models/SubcategoriaIngreso.js";
import ListaMaestra from "../models/ListaMaestra.js";

const router = express.Router();

// GET - Obtener todas las subcategorías
router.get("/", async (req, res) => {
  try {
    // Obtener todas las subcategorías ordenadas por código
    const subcategorias = await SubcategoriaIngreso.find().sort({
      codigo: 1, // Ordenar por código para mantener la jerarquía
      nivel: 1, // Y por nivel para asegurar la estructura correcta
    });

    // Validar la estructura del árbol
    subcategorias.forEach((sub) => {
      if (sub.nivel > 1) {
        const padre = subcategorias.find(
          (p) => p.codigo === sub.categoriaPadre
        );
        if (!padre) {
          console.error(
            `Subcategoría ${sub.codigo} (${sub.nombre}) tiene un categoriaPadre inválido`
          );
        }
      }
    });

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

// Función auxiliar para sincronizar items
async function sincronizarItemsRecursivamente(
  subcategoriaPadre,
  items,
  nivel = 1
) {
  const resultados = [];

  for (const item of items) {
    // Crear subcategoría para el item actual
    const codigoBase = subcategoriaPadre.codigo;
    const subcategoriasExistentes = await SubcategoriaIngreso.find({
      categoriaPadre: codigoBase,
    }).sort({ codigo: -1 });

    const siguienteNumero =
      subcategoriasExistentes.length > 0
        ? Math.max(
            ...subcategoriasExistentes.map((s) =>
              parseInt(s.codigo.split(".").pop())
            )
          ) + 1
        : 1;

    const nuevoCodigo = `${codigoBase}.${siguienteNumero}`;

    const nuevaSubcategoria = new SubcategoriaIngreso({
      codigo: nuevoCodigo,
      nombre: item.nombre,
      nivel: subcategoriaPadre.nivel + 1,
      categoriaPadre: codigoBase,
      activo: true,
    });

    await nuevaSubcategoria.save();
    resultados.push(nuevaSubcategoria);

    // Si tiene subitems, procesarlos recursivamente
    if (item.items && item.items.length > 0) {
      const subresultados = await sincronizarItemsRecursivamente(
        nuevaSubcategoria,
        item.items,
        nivel + 1
      );
      resultados.push(...subresultados);
    }
  }

  return resultados;
}

async function sincronizarItemsLista(subcategoria, listaMaestra) {
  try {
    console.log("=== Iniciando sincronizarItemsLista ===");

    // 1. Obtener el nivel base (primer número del código)
    const nivelBase = subcategoria.codigo.split(".")[0];
    const nivelActual = subcategoria.nivel;

    // 2. Encontrar todas las subcategorías del mismo nivel base y mismo nivel jerárquico
    const subcategoriasRelacionadas = await SubcategoriaIngreso.find({
      codigo: new RegExp(`^${nivelBase}\\.`),
      nivel: nivelActual,
    });

    console.log(
      `📌 Encontradas ${subcategoriasRelacionadas.length} subcategorías relacionadas del nivel ${nivelBase}`
    );

    const resultados = [];

    // 3. Para cada subcategoría relacionada, sincronizar los items
    for (const subRelacionada of subcategoriasRelacionadas) {
      // Verificar si la subcategoría ya tiene los items
      const subcategoriasHijas = await SubcategoriaIngreso.find({
        categoriaPadre: subRelacionada.codigo,
      }).sort({ codigo: 1 });

      const nombresExistentes = new Map(
        subcategoriasHijas.map((sub) => [
          sub.nombre.toLowerCase().trim(),
          sub.codigo,
        ])
      );

      // Procesar cada item de la lista maestra
      for (const item of listaMaestra.items) {
        if (!nombresExistentes.has(item.nombre.toLowerCase().trim())) {
          // Crear nueva subcategoría para este item
          const siguienteNumero =
            subcategoriasHijas.length > 0
              ? Math.max(
                  ...subcategoriasHijas.map((s) =>
                    parseInt(s.codigo.split(".").pop())
                  )
                ) + 1
              : 1;

          const nuevoCodigo = `${subRelacionada.codigo}.${siguienteNumero}`;

          const nuevaSubcategoria = new SubcategoriaIngreso({
            codigo: nuevoCodigo,
            nombre: item.nombre,
            nivel: subRelacionada.nivel + 1,
            categoriaPadre: subRelacionada.codigo,
            activo: true,
            // Heredar la lista maestra si el item original la tiene
            listaMaestra: item.listaMaestra || null,
          });

          await nuevaSubcategoria.save();
          resultados.push(nuevaSubcategoria);

          // Si el item tiene subitems, procesarlos recursivamente
          if (item.items && item.items.length > 0) {
            const subresultados = await sincronizarItemsRecursivamente(
              nuevaSubcategoria,
              item.items
            );
            resultados.push(...subresultados);
          }
        }
      }
    }

    return {
      itemsAgregados: resultados.length,
      itemsOmitidos: 0,
      subcategorias: resultados,
    };
  } catch (error) {
    console.error("❌ Error en sincronizarItemsLista:", error);
    throw error;
  }
}

// Modificar el endpoint de convertir lista para usar la función de sincronización
router.post("/:codigo/convertir-lista", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { listaId } = req.body;

    console.log("=== Iniciando conversión de lista ===");
    console.log("Código:", codigo);
    console.log("ListaId:", listaId);

    // 1. Obtener la lista maestra
    const listaMaestra = await ListaMaestra.findById(listaId);
    if (!listaMaestra) {
      console.log("❌ Lista maestra no encontrada");
      return res.status(404).json({
        mensaje: "Lista maestra no encontrada",
        listaId,
      });
    }

    console.log("✅ Lista maestra encontrada:", {
      nombre: listaMaestra.nombre,
      id: listaMaestra._id,
      items: listaMaestra.items?.length || 0,
    });

    // 2. Obtener la subcategoría base
    const subcategoriaBase = await SubcategoriaIngreso.findOne({ codigo });
    if (!subcategoriaBase) {
      console.log("❌ Subcategoría base no encontrada");
      return res.status(404).json({
        mensaje: "Subcategoría base no encontrada",
        codigo,
      });
    }

    console.log("✅ Subcategoría base encontrada:", {
      nombre: subcategoriaBase.nombre,
      codigo: subcategoriaBase.codigo,
      nivel: subcategoriaBase.nivel,
    });

    try {
      // 3. Asignar la lista maestra a la subcategoría base
      subcategoriaBase.listaMaestra = listaId;
      await subcategoriaBase.save();
      console.log("✅ Lista maestra asignada a subcategoría base");

      // 4. Sincronizar los items
      const resultado = await sincronizarItemsLista(
        subcategoriaBase,
        listaMaestra
      );
      console.log("✅ Sincronización completada:", resultado);

      return res.json({
        mensaje:
          resultado.itemsAgregados > 0
            ? "Se agregaron nuevos items de la lista"
            : "No hay nuevos items para agregar",
        ...resultado,
      });
    } catch (syncError) {
      console.error("❌ Error en sincronización:", syncError);
      throw new Error(`Error en sincronización: ${syncError.message}`);
    }
  } catch (error) {
    console.error("❌ Error detallado:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return res.status(500).json({
      mensaje: "Error al convertir la lista en subcategorías",
      error: error.message,
      detalles: error.stack,
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

// POST /:codigo/sincronizar-lista
router.post("/:codigo/sincronizar-lista", async (req, res) => {
  try {
    const { codigo } = req.params;

    // 1. Obtener la subcategoría
    const subcategoria = await SubcategoriaIngreso.findOne({ codigo });
    if (!subcategoria || !subcategoria.listaMaestra) {
      return res.status(404).json({
        mensaje: "Subcategoría no encontrada o no tiene lista maestra asociada",
      });
    }

    // 2. Obtener la lista maestra
    const listaMaestra = await ListaMaestra.findById(subcategoria.listaMaestra);
    if (!listaMaestra) {
      return res.status(404).json({
        mensaje: "Lista maestra no encontrada",
      });
    }

    // 3. Sincronizar items
    const result = await sincronizarItemsLista(subcategoria, listaMaestra);

    res.json({
      mensaje: "Lista sincronizada exitosamente",
      ...result,
    });
  } catch (error) {
    console.error("Error al sincronizar lista:", error);
    res.status(500).json({
      mensaje: "Error al sincronizar la lista",
      error: error.message,
    });
  }
});

export default router;
