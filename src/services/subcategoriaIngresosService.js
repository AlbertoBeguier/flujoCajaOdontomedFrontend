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

    // Extraer solo los datos necesarios
    const datos =
      subcategoria.tipo === "subcategoria" ? subcategoria.datos : subcategoria;

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
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
    const subcategorias = await getSubcategoriasIngresos();
    return subcategorias;
  } catch (error) {
    console.error("Error al analizar estructura:", error);
    throw error;
  }
};

const sincronizarTodasLasSubcategorias = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/sincronizar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al sincronizar");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en sincronizarTodasLasSubcategorias:", error);
    throw error;
  }
};

const asignarListaMaestra = async (codigo, listaId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/${codigo}/asignar-lista`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listaId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al asignar la lista maestra");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en asignarListaMaestra:", error);
    throw error;
  }
};

const convertirListaASubcategorias = async (codigo, listaId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/${codigo}/convertir-lista`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listaId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al convertir la lista");
    }

    return response.json();
  } catch (error) {
    console.error("Error en convertirListaASubcategorias:", error);
    throw error;
  }
};

const sincronizarListaMaestra = async (codigo) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/${codigo}/sincronizar-lista`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al sincronizar la lista");
    }

    return response.json();
  } catch (error) {
    console.error("Error en sincronizarListaMaestra:", error);
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
  asignarListaMaestra,
  convertirListaASubcategorias,
  sincronizarListaMaestra,
};
