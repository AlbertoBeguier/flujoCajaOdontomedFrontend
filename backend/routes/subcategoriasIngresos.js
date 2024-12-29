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

// POST - Convertir subcategoría en lista
router.post("/convertir-lista", async (req, res) => {
  try {
    const { codigo, nombre, nivel } = req.body;

    // 1. Actualizar la subcategoría original a lista
    const subcategoriaOriginal = await SubcategoriaIngreso.findOneAndUpdate(
      { codigo },
      { esLista: true },
      { new: true }
    );

    // 2. Encontrar todas las subcategorías con el mismo nombre y nivel
    const subcategoriasSimilares = await SubcategoriaIngreso.find({
      nombre: nombre,
      nivel: nivel,
      codigo: { $ne: codigo },
    });

    // 3. Convertir todas las similares en lista
    await Promise.all(
      subcategoriasSimilares.map(async (sub) => {
        await SubcategoriaIngreso.findOneAndUpdate(
          { codigo: sub.codigo },
          { esLista: true },
          { new: true }
        );
      })
    );

    res.json(subcategoriaOriginal);
  } catch (error) {
    console.error("Error al convertir en lista:", error);
    res.status(500).json({
      mensaje: "Error al convertir la subcategoría en lista",
      error: error.message,
    });
  }
});

// POST - Guardar items de una lista
router.post("/:codigo/items", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { items } = req.body;

    console.log("Recibido:", { codigo, items });

    // 1. Encontrar la subcategoría lista original
    const subcategoriaLista = await SubcategoriaIngreso.findOne({ codigo });
    if (!subcategoriaLista || !subcategoriaLista.esLista) {
      return res.status(404).json({ mensaje: "Lista no encontrada" });
    }

    // 2. Obtener el último número usado en los items existentes
    const itemsExistentes = await SubcategoriaIngreso.find({
      categoriaPadre: codigo,
    }).sort({ codigo: -1 });

    let ultimoNumero = 0;
    if (itemsExistentes.length > 0) {
      const ultimoCodigo = itemsExistentes[0].codigo;
      ultimoNumero = parseInt(ultimoCodigo.split(".").pop());
    }

    // 3. Crear subcategorías para cada item con números incrementales
    const itemsPromises = items.map(async (item, index) => {
      const nuevoNumero = ultimoNumero + index + 1;
      const codigoItem = `${codigo}.${nuevoNumero}`;

      // Verificar si ya existe
      const itemExistente = await SubcategoriaIngreso.findOne({
        codigo: codigoItem,
      });
      if (itemExistente) {
        throw new Error(`Ya existe un item con el código ${codigoItem}`);
      }

      await SubcategoriaIngreso.create({
        codigo: codigoItem,
        nombre: item.nombre,
        nivel: subcategoriaLista.nivel + 1,
        categoriaPadre: codigo,
        activo: true,
      });
    });

    await Promise.all(itemsPromises);

    // 4. Encontrar todas las listas similares
    const listasRelacionadas = await SubcategoriaIngreso.find({
      nombre: subcategoriaLista.nombre,
      nivel: subcategoriaLista.nivel,
      esLista: true,
    });

    // 5. Replicar los items en cada lista relacionada
    await Promise.all(
      listasRelacionadas.map(async (lista) => {
        if (lista.codigo !== codigo) {
          // Obtener el último número usado en esta lista
          const itemsExistentesLista = await SubcategoriaIngreso.find({
            categoriaPadre: lista.codigo,
          }).sort({ codigo: -1 });

          let ultimoNumeroLista = 0;
          if (itemsExistentesLista.length > 0) {
            const ultimoCodigo = itemsExistentesLista[0].codigo;
            ultimoNumeroLista = parseInt(ultimoCodigo.split(".").pop());
          }

          await Promise.all(
            items.map(async (item, index) => {
              const nuevoNumero = ultimoNumeroLista + index + 1;
              const codigoItem = `${lista.codigo}.${nuevoNumero}`;
              await SubcategoriaIngreso.create({
                codigo: codigoItem,
                nombre: item.nombre,
                nivel: lista.nivel + 1,
                categoriaPadre: lista.codigo,
                activo: true,
              });
            })
          );
        }
      })
    );

    res.json({ mensaje: "Items agregados exitosamente" });
  } catch (error) {
    console.error("Error detallado al guardar items:", error);
    res.status(500).json({
      mensaje: "Error al guardar los items",
      error: error.message,
    });
  }
});

// PUT - Actualizar nombre de item
router.put("/:itemCodigo", async (req, res) => {
  try {
    const { itemCodigo } = req.params;
    const { nombre } = req.body;

    // 1. Actualizar el item original
    const itemActualizado = await SubcategoriaIngreso.findOneAndUpdate(
      { codigo: itemCodigo },
      { nombre },
      { new: true }
    );

    if (!itemActualizado) {
      return res.status(404).json({ mensaje: "Item no encontrado" });
    }

    // 2. Encontrar la lista padre del item
    const listaPadre = await SubcategoriaIngreso.findOne({
      codigo: itemActualizado.categoriaPadre,
    });

    if (!listaPadre) {
      return res.status(404).json({ mensaje: "Lista padre no encontrada" });
    }

    // 3. Encontrar todas las listas similares
    const listasSimilares = await SubcategoriaIngreso.find({
      nombre: listaPadre.nombre,
      nivel: listaPadre.nivel,
      esLista: true,
    });

    // 4. Actualizar el item correspondiente en cada lista similar
    await Promise.all(
      listasSimilares.map(async (lista) => {
        if (lista.codigo !== itemActualizado.categoriaPadre) {
          // Obtener la posición del item en la lista original
          const posicionItem = parseInt(itemCodigo.split(".").pop());

          // Construir el código del item similar
          const codigoItemSimilar = `${lista.codigo}.${posicionItem}`;

          // Actualizar el item similar
          await SubcategoriaIngreso.findOneAndUpdate(
            { codigo: codigoItemSimilar },
            { nombre },
            { new: true }
          );
        }
      })
    );

    res.json(itemActualizado);
  } catch (error) {
    console.error("Error al actualizar item:", error);
    res.status(500).json({
      mensaje: "Error al actualizar el item",
      error: error.message,
    });
  }
});

export default router;
