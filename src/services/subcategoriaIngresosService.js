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
    console.log("Enviando datos al servidor:", subcategoriaData);

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
      throw new Error(errorData.mensaje || "Error al crear la subcategoría");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const guardarListaSubcategoria = async (subcategoriaId, lista) => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/${subcategoriaId}/lista`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ lista }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al guardar la lista");
  }

  return response.json();
};
