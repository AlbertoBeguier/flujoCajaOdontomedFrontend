import { API_BASE_URL, ENDPOINTS } from "../config/constants";

const getSubcategoriasEgresos = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}`,
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener subcategorías");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error en getSubcategoriasEgresos:", error);
    return [];
  }
};

const createSubcategoriaEgreso = async (subcategoria) => {
  try {
    console.log("Datos recibidos en el servicio:", subcategoria);

    // Validación de datos
    const datos =
      subcategoria.tipo === "subcategoria" ? subcategoria.datos : subcategoria;

    if (!datos.codigo || !datos.nombre?.trim()) {
      throw new Error(
        "El código y nombre son requeridos para crear una subcategoría"
      );
    }

    // Log de los datos procesados
    console.log("Datos a enviar al backend:", datos);

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}`,
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
      console.error("Error del servidor:", errorData);
      throw new Error(errorData.mensaje || "Error al crear la subcategoría");
    }

    return await response.json();
  } catch (error) {
    console.error("Error completo:", error);
    throw error;
  }
};

const updateSubcategoriaEgreso = async (codigo, cambios) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/${codigo}`,
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
    console.error("Error en updateSubcategoriaEgreso:", error);
    throw error;
  }
};

const actualizarItem = async (codigo, nombre) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/${codigo}`,
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
    const subcategorias = await getSubcategoriasEgresos();
    return subcategorias;
  } catch (error) {
    console.error("Error al analizar estructura:", error);
    throw error;
  }
};

const sincronizarTodasLasSubcategorias = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/sincronizar`,
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
      throw new Error(error.message || "Error en la sincronización");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en sincronizarTodasLasSubcategorias:", error);
    throw error;
  }
};

const asignarListaMaestra = async (codigo, listaId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/${codigo}/asignar-lista`,
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
      throw new Error(errorData.message || "Error al asignar la lista maestra");
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
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/${codigo}/convertir-lista`,
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

    const data = await response.json();

    // Recargar las subcategorías inmediatamente para mostrar los cambios
    await getSubcategoriasEgresos();

    return data;
  } catch (error) {
    console.error("Error en convertirListaASubcategorias:", error);
    throw error;
  }
};

const sincronizarListaMaestra = async (codigo) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/${codigo}/sincronizar-lista`,
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

const descargarBackup = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}/backup`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener la copia de seguridad");
    }

    const data = await response.json();

    // Crear y descargar archivo de subcategorías
    const subcategoriasBlob = new Blob([data.subcategorias], {
      type: "application/json",
    });
    const subcategoriasUrl = window.URL.createObjectURL(subcategoriasBlob);
    const subcategoriasLink = document.createElement("a");
    subcategoriasLink.href = subcategoriasUrl;
    subcategoriasLink.download = `subcategorias_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(subcategoriasLink);
    subcategoriasLink.click();
    window.URL.revokeObjectURL(subcategoriasUrl);
    document.body.removeChild(subcategoriasLink);

    // Crear y descargar archivo de listas maestras
    const listasMaestrasBlob = new Blob([data.listasMaestras], {
      type: "application/json",
    });
    const listasMaestrasUrl = window.URL.createObjectURL(listasMaestrasBlob);
    const listasMaestrasLink = document.createElement("a");
    listasMaestrasLink.href = listasMaestrasUrl;
    listasMaestrasLink.download = `listas_maestras_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(listasMaestrasLink);
    listasMaestrasLink.click();
    window.URL.revokeObjectURL(listasMaestrasUrl);
    document.body.removeChild(listasMaestrasLink);

    return data;
  } catch (error) {
    console.error("Error al descargar backup:", error);
    throw error;
  }
};

export {
  getSubcategoriasEgresos,
  createSubcategoriaEgreso,
  updateSubcategoriaEgreso,
  actualizarItem,
  analizarEstructuraSubcategorias,
  sincronizarTodasLasSubcategorias,
  asignarListaMaestra,
  convertirListaASubcategorias,
  sincronizarListaMaestra,
  descargarBackup,
};
