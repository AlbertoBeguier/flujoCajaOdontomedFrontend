import { API_BASE_URL } from "../config/constants";

export const createCategoria = async (categoriaData) => {
  const response = await fetch(`${API_BASE_URL}/api/categorias-ingresos`, {
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
