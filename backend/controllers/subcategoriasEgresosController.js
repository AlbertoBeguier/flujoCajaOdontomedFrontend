import SubcategoriaEgreso from "../models/subcategoriaEgreso.js";

// Obtener todas las subcategorías
export const getSubcategoriasEgresos = async (req, res) => {
  try {
    const subcategorias = await SubcategoriaEgreso.find().sort({ codigo: 1 });
    res.json(subcategorias);
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al obtener las subcategorías",
        error: error.message,
      });
  }
};

// Crear una nueva subcategoría
export const createSubcategoriaEgreso = async (req, res) => {
  try {
    const subcategoria = new SubcategoriaEgreso(req.body);
    await subcategoria.save();
    res.status(201).json(subcategoria);
  } catch (error) {
    res
      .status(400)
      .json({
        mensaje: "Error al crear la subcategoría",
        error: error.message,
      });
  }
};
