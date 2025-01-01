import { API_BASE_URL, ENDPOINTS } from "../config/constants";

const getSubcategoriasIngresos = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener subcategorías");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getSubcategoriasIngresos:", error);
    throw error;
  }
};

const createSubcategoriaIngreso = async (subcategoria) => {
  try {
    console.log("Enviando al backend:", subcategoria);

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subcategoria),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al crear la subcategoría");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createSubcategoriaIngreso:", error);
    throw error;
  }
};

const updateSubcategoriaIngreso = async (codigo, cambios) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/${codigo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cambios),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar la subcategoría");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateSubcategoriaIngreso:", error);
    throw error;
  }
};

const actualizarItem = async (codigo, nombre) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/${codigo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarItem:", error);
    throw error;
  }
};

const analizarEstructuraSubcategorias = async () => {
  try {
    return await getSubcategoriasIngresos();
  } catch (error) {
    console.error("Error al analizar estructura:", error);
    throw error;
  }
};

const sincronizarTodasLasSubcategorias = async () => {
  try {
    await getSubcategoriasIngresos();
    return true;
  } catch (error) {
    console.error("Error al sincronizar:", error);
    throw error;
  }
};

export {
  getSubcategoriasIngresos,
  createSubcategoriaIngreso,
  updateSubcategoriaIngreso,
  actualizarItem,
  analizarEstructuraSubcategorias,
  sincronizarTodasLasSubcategorias,
};
