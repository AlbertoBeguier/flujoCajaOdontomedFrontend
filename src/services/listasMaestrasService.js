import { API_BASE_URL, ENDPOINTS } from "../config/constants";

export const getListasMaestras = async () => {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LISTAS_MAESTRAS}`);
  if (response.status === 404) {
    return []; // Retornar array vacío si no hay listas
  }
  if (!response.ok) {
    throw new Error("Error al obtener las listas maestras");
  }
  return response.json();
};

export const createListaMaestra = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.LISTAS_MAESTRAS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al crear la lista maestra");
    }

    return response.json();
  } catch (error) {
    console.error("Error en createListaMaestra:", error);
    throw error;
  }
};

export const getListaPorSubcategoria = async (codigoSubcategoria) => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.LISTAS_MAESTRAS}/subcategoria/${codigoSubcategoria}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener la lista maestra");
  }
  return response.json();
};
