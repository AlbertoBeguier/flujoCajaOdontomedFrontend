import { API_BASE_URL } from "../config/constants";

export const createEgreso = async (egresoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/egresos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(egresoData),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al procesar la solicitud");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error al crear el egreso");
  }
};

export const getEgresos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/egresos`);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al obtener los egresos");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error al obtener los egresos");
  }
};

export const updateEgreso = async (id, egresoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/egresos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(egresoData),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al actualizar el egreso");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error al actualizar el egreso");
  }
};
