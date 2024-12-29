import { API_BASE_URL, ENDPOINTS } from "../config/constants";
import { getToken } from "./authService";

export const getSubcategoriasIngresos = async () => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`
  );

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(
        errorData.mensaje || "Error al obtener las subcategorías"
      );
    } else {
      throw new Error("Error en la conexión con el servidor");
    }
  }

  return response.json();
};

export const createSubcategoriaIngreso = async (subcategoriaData) => {
  try {
    console.log("Datos enviados al servidor:", subcategoriaData);

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subcategoriaData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error del servidor:", errorData);
      throw new Error(errorData.mensaje || "Error al crear la subcategoría");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const agregarSubcategoria = async (
  categoriaPadreId,
  subcategoriaData
) => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        ...subcategoriaData,
        categoriaPadre: categoriaPadreId,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al agregar la subcategoría");
  }

  return response.json();
};

export const updateSubcategoriaIngreso = async (subcategoriaData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subcategoriaData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.mensaje || "Error al actualizar la subcategoría"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const convertirEnLista = async (subcategoriaData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/convertir-lista`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subcategoriaData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al convertir en lista");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const guardarItems = async (codigo, items) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/subcategorias-ingresos/${codigo}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al guardar items");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const actualizarItem = async (itemCodigo, nombre) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/subcategorias-ingresos/${itemCodigo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al actualizar item");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};
