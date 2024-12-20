import { API_BASE_URL } from "../config/constants";

export const createCategoriaEgreso = async (categoriaData) => {
  const response = await fetch(`${API_BASE_URL}/api/categorias-egresos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoriaData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.mensaje || "Error al crear la categoría");
  }

  return response.json();
};

export const getCategoriasEgresos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categorias-egresos`);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al obtener las categorías");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error al obtener las categorías");
  }
};
