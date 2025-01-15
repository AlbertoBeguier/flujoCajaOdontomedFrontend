import { API_BASE_URL, ENDPOINTS } from "../config/constants";

export const createSubcategoriaEgreso = async (subcategoriaData) => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subcategoriaData),
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.mensaje || "Error al crear la subcategoría");
  }

  return response.json();
};

export const getSubcategoriasEgresos = async () => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_EGRESOS}`
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
