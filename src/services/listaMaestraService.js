import { API_BASE_URL } from "../config/constants";

const API_URL = `${API_BASE_URL}/api/listas-maestras`;

export const getListasMaestras = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener listas maestras");
  }
  return response.json();
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
