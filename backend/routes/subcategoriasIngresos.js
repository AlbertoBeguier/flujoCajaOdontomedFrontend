import express from "express";
import SubcategoriaIngreso from "../models/SubcategoriaIngreso.js";

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
    console.log("Datos recibidos en el servidor:", req.body);

    // Validar datos requeridos
    if (!req.body.codigo || !req.body.nombre) {
      return res.status(400).json({
        mensaje:
          "El código y nombre son requeridos para crear una subcategoría",
      });
    }

    const subcategoria = new SubcategoriaIngreso(req.body);
    await subcategoria.save();

    // Si la subcategoría va a ser una lista
    if (subcategoria.esLista) {
      // Encontrar el padre
      const padre = await SubcategoriaIngreso.findOne({
        codigo: subcategoria.categoriaPadre,
      });

      if (padre) {
        // Encontrar todos los elementos similares
        const elementosSimilares = await SubcategoriaIngreso.find({
          nivel: padre.nivel,
          categoriaPadre: padre.categoriaPadre,
        });

        // Crear la misma subcategoría para cada elemento similar
        await Promise.all(
          elementosSimilares.map(async (elemento) => {
            // No crear si ya existe o si es el padre original
            if (elemento.codigo !== subcategoria.categoriaPadre) {
              const existente = await SubcategoriaIngreso.findOne({
                nombre: subcategoria.nombre,
                categoriaPadre: elemento.codigo,
              });

              if (!existente) {
                const nuevoCodigo = `${elemento.codigo}.${subcategoria.codigo
                  .split(".")
                  .pop()}`;

                const nuevaSubcategoria = new SubcategoriaIngreso({
                  codigo: nuevoCodigo,
                  nombre: subcategoria.nombre,
                  nivel: subcategoria.nivel,
                  categoriaPadre: elemento.codigo,
                  lista: subcategoria.lista,
                  esLista: true,
                  codigoBase: nuevoCodigo,
                });
                await nuevaSubcategoria.save();
              }
            }
          })
        );
      }
    }

    res.status(201).json(subcategoria);
  } catch (error) {
    console.error("Error al crear subcategoría:", error);
    res.status(400).json({
      mensaje: "Error al crear la subcategoría",
      error: error.message,
    });
  }
});

// PUT - Actualizar lista
router.put("/:id/lista", async (req, res) => {
  try {
    const { id } = req.params;
    const { lista } = req.body;

    const subcategoria = await SubcategoriaIngreso.findById(id);

    if (!subcategoria) {
      return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
    }

    // Actualizar la subcategoría original
    const codigoBaseOriginal = subcategoria.codigo + ".";
    const itemsActualizadosOriginal = lista.items.map((item, index) => ({
      ...item,
      codigo: codigoBaseOriginal + (index + 1),
      numero: index + 1,
    }));

    subcategoria.lista = {
      ...lista,
      items: itemsActualizadosOriginal,
    };
    subcategoria.esLista = true;
    subcategoria.codigoBase = subcategoria.codigo;
    await subcategoria.save();

    // Encontrar el padre
    const padre = await SubcategoriaIngreso.findOne({
      codigo: subcategoria.categoriaPadre,
    });

    if (padre) {
      // Encontrar todos los profesionales similares
      const padresSimilares = await SubcategoriaIngreso.find({
        nivel: padre.nivel,
        categoriaPadre: padre.categoriaPadre,
      });

      // Actualizar cada lista similar
      await Promise.all(
        padresSimilares.map(async (padreSimilar) => {
          if (padreSimilar.codigo !== subcategoria.categoriaPadre) {
            let subSimilar = await SubcategoriaIngreso.findOne({
              nombre: subcategoria.nombre,
              categoriaPadre: padreSimilar.codigo,
            });

            if (!subSimilar) {
              subSimilar = new SubcategoriaIngreso({
                codigo: `${padreSimilar.codigo}.${subcategoria.codigo
                  .split(".")
                  .pop()}`,
                nombre: subcategoria.nombre,
                nivel: subcategoria.nivel,
                categoriaPadre: padreSimilar.codigo,
                esLista: true,
                codigoBase: `${padreSimilar.codigo}.${subcategoria.codigo
                  .split(".")
                  .pop()}`,
              });
            }

            const codigoBaseItems = subSimilar.codigo + ".";
            const itemsActualizados = lista.items.map((item, index) => ({
              ...item,
              codigo: codigoBaseItems + (index + 1),
              numero: index + 1,
            }));

            subSimilar.lista = {
              ...lista,
              items: itemsActualizados,
            };
            subSimilar.esLista = true;

            await subSimilar.save();
          }
        })
      );
    }

    res.json({
      mensaje: "Lista actualizada en todas las subcategorías similares",
    });
  } catch (error) {
    console.error("Error al actualizar lista:", error);
    res.status(500).json({ mensaje: error.message });
  }
});

export default router;
