import { API_BASE_URL, ENDPOINTS } from "../config/constants";

// Usar ENDPOINTS para mantener consistencia y centralizar las rutas
const API_URL = `${API_BASE_URL}${ENDPOINTS.LISTAS_MAESTRAS}`;

export const getListasMaestras = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener listas maestras");
    }
    return await response.json();
  } catch (err) {
    console.error("Error en getListasMaestras:", err);
    throw new Error("Error al obtener listas maestras");
  }
};

export const getListaMaestra = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener lista maestra");
  }
  return response.json();
};

export const createListaMaestra = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear lista maestra");
  }
  return response.json();
};

export const addItemToLista = async (listaId, itemData) => {
  try {
    const response = await fetch(`${API_URL}/${listaId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al agregar item a la lista");
    }

    return response.json();
  } catch (error) {
    console.error("Error en addItemToLista:", error);
    throw error;
  }
};

export const getListaPorSubcategoria = async (codigoSubcategoria) => {
  const response = await fetch(`${API_URL}/subcategoria/${codigoSubcategoria}`);
  if (!response.ok) {
    throw new Error("Error al obtener la lista maestra");
  }
  return response.json();
};
